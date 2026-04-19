import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { Buffer } from 'node:buffer';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const locationsFilePath = path.resolve(__dirname, '../data/locations.json');
const categoriesFilePath = path.resolve(__dirname, '../data/categories.json');

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const createDefaultRegularHours = () =>
  days.map((day) => ({
    day,
    open_time: day === 'Sunday' ? null : '09:00',
    close_time: day === 'Sunday' ? null : '17:00',
    is_closed: day === 'Sunday',
  }));

const normalizeCategory = (category, id) => ({
  id,
  name: category.name?.trim() || `Category ${id}`,
});

const normalizeLocation = (location, id, categoryId) => ({
  id,
  name: location.name?.trim() || 'Untitled Location',
  categoryId,
  address: location.address?.trim() || '',
  city: location.city?.trim() || '',
  state: location.state?.trim() || '',
  zip_code: location.zip_code?.trim() || '',
  regularHours: Array.isArray(location.regularHours) && location.regularHours.length > 0
    ? location.regularHours
    : createDefaultRegularHours(),
  timeSlots: Array.isArray(location.timeSlots) ? location.timeSlots : [],
  holidays: Array.isArray(location.holidays) ? location.holidays : [],
});

const writeJsonFile = async (filePath, data) => {
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
};

const ensureJsonFile = async (filePath) => {
  await mkdir(path.dirname(filePath), { recursive: true });

  try {
    await readFile(filePath, 'utf8');
  } catch {
    await writeJsonFile(filePath, []);
  }
};

const readJsonArray = async (filePath) => {
  const raw = await readFile(filePath, 'utf8');
  const parsed = JSON.parse(raw);

  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed;
};

const findCategoryByName = (categories, categoryName) =>
  categories.find((category) => category.name.toLowerCase() === categoryName.toLowerCase());

const ensureCategory = (categories, categoryName, fallbackCategoryId) => {
  const trimmedCategoryName = typeof categoryName === 'string' ? categoryName.trim() : '';

  if (trimmedCategoryName) {
    const existingCategory = findCategoryByName(categories, trimmedCategoryName);

    if (existingCategory) {
      return { categories, categoryId: existingCategory.id };
    }

    const nextCategory = normalizeCategory(
      { name: trimmedCategoryName },
      categories.reduce((maxId, category) => Math.max(maxId, category.id), 0) + 1,
    );

    return {
      categories: [...categories, nextCategory],
      categoryId: nextCategory.id,
    };
  }

  const parsedFallbackCategoryId = Number.parseInt(fallbackCategoryId, 10);

  if (!Number.isNaN(parsedFallbackCategoryId)) {
    const existingCategory = categories.find((category) => category.id === parsedFallbackCategoryId);

    if (existingCategory) {
      return { categories, categoryId: existingCategory.id };
    }
  }

  return ensureCategory(categories, 'General');
};

const serializeLocation = (location, categories) => ({
  ...location,
  category: categories.find((category) => category.id === location.categoryId)?.name || 'General',
});

const readStore = async () => {
  await Promise.all([
    ensureJsonFile(locationsFilePath),
    ensureJsonFile(categoriesFilePath),
  ]);

  const [rawLocations, rawCategories] = await Promise.all([
    readJsonArray(locationsFilePath),
    readJsonArray(categoriesFilePath),
  ]);

  let categories = rawCategories.map((category, index) =>
    normalizeCategory(category, Number.parseInt(category.id, 10) || index + 1),
  );

  const normalizedLocations = rawLocations.map((location, index) => {
    const resolvedCategory = ensureCategory(categories, location.category, location.categoryId);

    categories = resolvedCategory.categories;

    return normalizeLocation(
      location,
      Number.parseInt(location.id, 10) || index + 1,
      resolvedCategory.categoryId,
    );
  });

  const categoriesChanged = JSON.stringify(rawCategories) !== JSON.stringify(categories);
  const locationsChanged = JSON.stringify(rawLocations) !== JSON.stringify(normalizedLocations);

  if (categoriesChanged) {
    await writeJsonFile(categoriesFilePath, categories);
  }

  if (locationsChanged) {
    await writeJsonFile(locationsFilePath, normalizedLocations);
  }

  return {
    categories,
    locations: normalizedLocations,
  };
};

const writeStore = async ({ categories, locations }) => {
  await Promise.all([
    writeJsonFile(categoriesFilePath, categories),
    writeJsonFile(locationsFilePath, locations),
  ]);
};

const sendJson = (res, statusCode, payload) => {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
};

const parseBody = async (req) => {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  if (chunks.length === 0) {
    return {};
  }

  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
};

const withApiBase = (pathname, basePath) => pathname.replace(new RegExp(`^${basePath}`), '') || '/';

const handleCategoriesRequest = async (req, res) => {
  if (req.method !== 'GET') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  const { categories } = await readStore();
  sendJson(res, 200, { categories });
};

const handleCollectionRequest = async (req, res) => {
  if (req.method === 'GET') {
    const { categories, locations } = await readStore();
    sendJson(res, 200, { locations: locations.map((location) => serializeLocation(location, categories)) });
    return;
  }

  if (req.method === 'POST') {
    const { categories: currentCategories, locations } = await readStore();
    const body = await parseBody(req);
    const nextId = locations.reduce((maxId, location) => Math.max(maxId, location.id), 0) + 1;
    const resolvedCategory = ensureCategory(currentCategories, body.category, body.categoryId);
    const createdLocation = normalizeLocation(body, nextId, resolvedCategory.categoryId);

    locations.push(createdLocation);
    await writeStore({ categories: resolvedCategory.categories, locations });
    sendJson(res, 201, serializeLocation(createdLocation, resolvedCategory.categories));
    return;
  }

  sendJson(res, 405, { error: 'Method not allowed' });
};

const handleItemRequest = async (req, res, id) => {
  const locationId = Number.parseInt(id, 10);

  if (Number.isNaN(locationId)) {
    sendJson(res, 400, { error: 'Invalid location id' });
    return;
  }

  const { categories, locations } = await readStore();
  const existingLocation = locations.find((location) => location.id === locationId);

  if (!existingLocation) {
    sendJson(res, 404, { error: 'Location not found' });
    return;
  }

  if (req.method === 'GET') {
    sendJson(res, 200, serializeLocation(existingLocation, categories));
    return;
  }

  if (req.method === 'PUT') {
    const body = await parseBody(req);
    const resolvedCategory = ensureCategory(categories, body.category, body.categoryId);
    const updatedLocation = normalizeLocation(body, locationId, resolvedCategory.categoryId);
    const nextLocations = locations.map((location) =>
      location.id === locationId ? updatedLocation : location,
    );

    await writeStore({ categories: resolvedCategory.categories, locations: nextLocations });
    sendJson(res, 200, serializeLocation(updatedLocation, resolvedCategory.categories));
    return;
  }

  if (req.method === 'DELETE') {
    const nextLocations = locations.filter((location) => location.id !== locationId);
    await writeStore({ categories, locations: nextLocations });
    sendJson(res, 200, { success: true });
    return;
  }

  sendJson(res, 405, { error: 'Method not allowed' });
};

export const createLocationsApiMiddleware = () => async (req, res, next) => {
  const url = new URL(req.url ?? '/', 'http://localhost');

  if (!url.pathname.startsWith('/api/locations') && !url.pathname.startsWith('/api/categories')) {
    next();
    return;
  }

  try {
    if (url.pathname.startsWith('/api/categories')) {
      const route = withApiBase(url.pathname, '/api/categories');

      if (route === '/') {
        await handleCategoriesRequest(req, res);
        return;
      }

      sendJson(res, 404, { error: 'Endpoint not found' });
      return;
    }

    const route = withApiBase(url.pathname, '/api/locations');

    if (route === '/') {
      await handleCollectionRequest(req, res);
      return;
    }

    const routeMatch = route.match(/^\/(\d+)$/);

    if (routeMatch) {
      await handleItemRequest(req, res, routeMatch[1]);
      return;
    }

    sendJson(res, 404, { error: 'Endpoint not found' });
  } catch (error) {
    sendJson(res, 500, {
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};