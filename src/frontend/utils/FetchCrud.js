import { useFetchApi, setDefaultHeaders } from "./FetchAPI";

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
 * @property {Function} fetchApiToRef - Function to fetch data and return it in refs
 * @example
 * const userCrud = useFetchApiCrud('users');
 */
export function useFetchApiCrud(path, baseUrl = null, additionalHeaders = {}) {

    const { fetchApiToRef } = useFetchApi(baseUrl, additionalHeaders);

    // Fetch a single item by ID
    function read(id, headers = {}, timeout = 5000) {
        return fetchApiToRef({
            url: `${path}/${id}`,
            method: 'GET',
            headers,
            timeout,
        });
    }

    // Fetch all items or a paginated list
    function readAll(queryParams = {}, headers = {}, timeout = 5000) {
        const query = new URLSearchParams(queryParams).toString();
        const urlWithParams = query ? `${path}?${query}` : path;

        return fetchApiToRef({
            url: urlWithParams,
            method: 'GET',
            headers,
            timeout,
        });
    }

    // Create a new item
    function create(data, headers = {}, timeout = 5000) {
        return fetchApiToRef({
            url: path,
            data,
            method: 'POST',
            headers,
            timeout,
        });
    }

    // Update an existing item by ID
    function update(id, data, headers = {}, timeout = 5000) {
        return fetchApiToRef({
            url: `${path}/${id}`,
            data,
            method: 'PATCH',
            headers,
            timeout,
        });
    }

    // Delete an item by ID
    function del(id, headers = {}, timeout = 5000) {
        return fetchApiToRef({
            url: `${path}/${id}`,
            method: 'DELETE',
            headers,
            timeout,
        });
    }

    // Follow a user
    function followUser(userId, headers = {}, timeout = 5000) {
        return fetchApiToRef({
            url: `${path}/${userId}/follow`,
            method: 'POST',
            headers,
            timeout,
        });
    }

    // Unfollow a user
    function unfollowUser(userId, headers = {}, timeout = 5000) {
        return fetchApiToRef({
            url: `${path}/${userId}/follow`,
            method: 'DELETE',
            headers,
            timeout,
        });
    }

    // Fetch comments for a specific post
    function getCommentsByPost(postId, queryParams = {}, headers = {}, timeout = 5000) {
        const query = new URLSearchParams(queryParams).toString();
        const urlWithParams = query ? `comments/${postId}?${query}` : `comments/${postId}`;

        return fetchApiToRef({
            url: urlWithParams,
            method: 'GET',
            headers,
            timeout,
        });
    }

    // Like an item (post, comment, etc.)
    function likeItem(id, headers = {}, timeout = 5000) {
        return fetchApiToRef({
            url: `${path}/${id}/like`,
            method: 'POST',
            headers,
            timeout,
        });
    }

    // Unlike an item (post, comment, etc.)
    function unlikeItem(id, headers = {}, timeout = 5000) {
        return fetchApiToRef({
            url: `${path}/${id}/like`,
            method: 'DELETE',
            headers,
            timeout,
        });
    }

    // Add a member to a group
    function addMember(groupId, memberData, headers = {}, timeout = 5000) {
        return fetchApiToRef({
            url: `groups/${groupId}/members`,
            data: memberData,
            method: 'POST',
            headers,
            timeout,
        });
    }

    // Remove a member from a group
    function removeMember(groupId, userId, headers = {}, timeout = 5000) {
        return fetchApiToRef({
            url: `groups/${groupId}/members/${userId}`,
            method: 'DELETE',
            headers,
            timeout,
        });
    }

    return {
        read,
        readAll,
        create,
        update,
        del,
        followUser,
        unfollowUser,
        getCommentsByPost,
        likeItem,
        unlikeItem,
        addMember,
        removeMember,
        fetchApiToRef,
    };
}