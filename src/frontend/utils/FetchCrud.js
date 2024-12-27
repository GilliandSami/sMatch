import { useFetchApi } from "./FetchAPI";

/**
 * Fetch data from an API and perform CRUD operations
 *
 * @param {string} path - The path to the API
 * @param {string} [baseUrl=null] - The base URL of the API
 * @param {object} [additionalHeaders={}] - Additional headers to send with each request
 * @returns {Object} The fetch API utilities
 * @property {Function} read - Function to read data
 * @property {Function} readAll - Function to read all data
 * @property {Function} create - Function to create data
 * @property {Function} del - Function to delete data
 * @property {Function} update - Function to update data
 * @property {Function} likeItem - Function to like an item
 * @property {Function} unlikeItem - Function to unlike an item
 * @example
 * const userCrud = useFetchApiCrud('users');
 */
export function useFetchApiCrud(path, baseUrl = null, additionalHeaders = {}) {
    const { fetchApi } = useFetchApi(baseUrl, additionalHeaders);

    // Fetch a single item by ID
    async function read(id, headers = {}, timeout = 5000) {
        try {
            return await fetchApi({
                url: `${path}/${id}`,
                method: "GET",
                headers,
                timeout,
            });
        } catch (error) {
            console.error(`Error fetching item with ID ${id}:`, error);
            throw error;
        }
    }

    // Fetch all items or a paginated list
    async function readAll(queryParams = {}, headers = {}, timeout = 5000) {
        const query = new URLSearchParams(queryParams).toString();
        const urlWithParams = query ? `${path}?${query}` : path;

        try {
            return await fetchApi({
                url: urlWithParams,
                method: "GET",
                headers,
                timeout,
            });
        } catch (error) {
            console.error(`Error fetching items with query params ${query}:`, error);
            throw error;
        }
    }

    // Create a new item
    async function create(data, headers = {}, timeout = 5000) {
        try {
            return await fetchApi({
                url: path,
                data,
                method: "POST",
                headers,
                timeout,
            });
        } catch (error) {
            console.error("Error creating item:", error);
            throw error;
        }
    }

    // Update an existing item by ID
    async function update(id, data, headers = {}, timeout = 5000) {
        try {
            return await fetchApi({
                url: `${path}/${id}`,
                data,
                method: "PATCH",
                headers,
                timeout,
            });
        } catch (error) {
            console.error(`Error updating item with ID ${id}:`, error);
            throw error;
        }
    }

    // Delete an item by ID
    async function del(id, headers = {}, timeout = 5000) {
        try {
            return await fetchApi({
                url: `${path}/${id}`,
                method: "DELETE",
                headers,
                timeout,
            });
        } catch (error) {
            console.error(`Error deleting item with ID ${id}:`, error);
            throw error;
        }
    }

    // Like an item (post, comment, etc.)
    async function likeItem(id, headers = {}, timeout = 5000) {
        try {
            return await fetchApi({
                url: `${path}/${id}/like`,
                method: "POST",
                headers,
                timeout,
            });
        } catch (error) {
            console.error(`Error liking item with ID ${id}:`, error);
            throw error;
        }
    }

    // Unlike an item (post, comment, etc.)
    async function unlikeItem(id, headers = {}, timeout = 5000) {
        try {
            return await fetchApi({
                url: `${path}/${id}/like`,
                method: "DELETE",
                headers,
                timeout,
            });
        } catch (error) {
            console.error(`Error unliking item with ID ${id}:`, error);
            throw error;
        }
    }

    // Add a member to a group
    async function addMember(groupId, memberData, headers = {}, timeout = 5000) {
        try {
            return await fetchApi({
                url: `groups/${groupId}/members`,
                data: memberData,
                method: "POST",
                headers,
                timeout,
            });
        } catch (error) {
            console.error(`Error adding member to group ${groupId}:`, error);
            throw error;
        }
    }

    // Remove a member from a group
    async function removeMember(groupId, userId, headers = {}, timeout = 5000) {
        try {
            return await fetchApi({
                url: `groups/${groupId}/members/${userId}`,
                method: "DELETE",
                headers,
                timeout,
            });
        } catch (error) {
            console.error(`Error removing member with ID ${userId} from group ${groupId}:`, error);
            throw error;
        }
    }

    return {
        read,
        readAll,
        create,
        update,
        del,
        likeItem,
        unlikeItem,
        addMember,
        removeMember,
    };
}
