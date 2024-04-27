import { Model } from "mongoose";
import { estimatedDocumentCount } from "./db";

/**
 *
 * @param { number } limit number of items to show per page
 * @param { number } offset number of items to skip
 * @param { Model<any> }collection
 * @param { object }query
 * @returns { object } pagination object
 */
export const getPagination = async (
  limit: number,
  offset: number,
  collection: Model<any>,
  query?: object
): Promise<object> => {
  try {
    const documentCount = await estimatedDocumentCount(collection, query);
    const pages = Math.ceil(documentCount / limit);
    const currentPage = Math.ceil(offset / limit) + 1;
    const previousPage = currentPage - 1;
    const nextPage = currentPage + 1;
    const hasPreviousPage = currentPage > 1;
    const hasNextPage = currentPage < pages;
    const firstPage = 1;
    const lastPage = pages;
    const previousPageUrl = hasPreviousPage
      ? `?limit=${limit}&offset=${(previousPage - 1) * limit}`
      : "";
    const nextPageUrl = hasNextPage
      ? `?limit=${limit}&offset=${(nextPage - 1) * limit}`
      : "";
    const firstPageUrl = `?limit=${limit}&offset=${(firstPage - 1) * limit}`;
    const lastPageUrl = `?limit=${limit}&offset=${(lastPage - 1) * limit}`;
    const currentPageUrl = `?limit=${limit}&offset=${offset}`;
    const pagination = {
      total: documentCount,
      pages,
      currentPage,
      previousPage,
      nextPage,
      hasPreviousPage,
      hasNextPage,
      firstPage,
      lastPage,
      previousPageUrl,
      nextPageUrl,
      firstPageUrl,
      lastPageUrl,
      currentPageUrl,
    };
    return pagination;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * This pagination is used when there are responses from two or more models and they need pagination.
 * So, first combine the response array and apply this pagination in that combined array.
 * 
 * @param { any[] } data Array that need to be paginated
 * @param { Number } offset The number of items to skip 
 * @param { Number } limit The number of items to show per page
 * 
 * @returns { data: any[], pagination: object } Returns paginated data and pagination object
 */
export function applyPagination(data: any[], offset: number, limit: number) {
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / limit);
  const currentPage = Math.floor(offset / limit) + 1;
  const previousPage = currentPage - 1;
  const nextPage = currentPage + 1;
  const hasPreviousPage = previousPage > 0;
  const hasNextPage = nextPage <= totalPages;
  const previousPageUrl = hasPreviousPage
    ? `?limit=${limit}&offset=${(previousPage - 1) * limit}`
    : "";
  const nextPageUrl = hasNextPage
    ? `?limit=${limit}&offset=${(nextPage-1) * limit}`
    : "";
  const firstPageUrl = "?limit=" + limit + "&offset=0";
  const lastPageUrl = "?limit=" + limit + "&offset=" + (totalPages - 1) * limit;
  const currentPageUrl = `?limit=${limit}&offset=${offset}`;

  const dataSubset = data.slice(offset, offset + limit);

  return {
    data: dataSubset,
    pagination: {
      total: totalItems,
      pages: totalPages,
      currentPage,
      previousPage,
      nextPage,
      hasPreviousPage,
      hasNextPage,
      firstPage: 1,
      lastPage: totalPages,
      previousPageUrl,
      nextPageUrl,
      firstPageUrl,
      lastPageUrl,
      currentPageUrl,
    },
  };
}

/**
 * Generates pagination data for fetched data.
 *
 * @param {any[]} data - The array of data to be paginated
 * @param {number} items - The number of items per page
 * @return {{ total?: number, items?: number }} An object containing the total number of items and the number of items per page
 */
export const getPaginationForFetchedData = (data: any[], items: number): { total?: number; items?: number } => {
  if (data && Array.isArray(data) && data.length) {
      return {
          total: data.length,
          items,
      };
  }
  return {};
};
