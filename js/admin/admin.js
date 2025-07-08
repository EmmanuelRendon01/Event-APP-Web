/**
 * Base URL for the mock API (JSON Server)
 */
export const URL_DATA = "http://localhost:3000/"

/**
 * Create a new resource in the API
 * @param {string} url - The endpoint URL
 * @param {Object} data - The data to send
 * @returns {Promise<Object>} The created resource
 */
export async function create(url, data) {
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })

    if (!res.ok) {
        throw new Error(`Error al crear recurso en ${url}`);
    }

    return await res.json();
}

/**
 * Remove a resource from the API by key and id
 * @param {string} url - The base URL
 * @param {string} key - The resource key (e.g., 'events')
 * @param {string|number} id - The resource ID
 * @returns {Promise<boolean>} True if deleted
 */
export async function remove(url, key, id) {
    const res = await fetch(`${url}${key}/${id}`, {
        method: "DELETE"
    })

    if (!res.ok) {
        throw new Error(`Error al eliminar recurso en ${url}/${id}`);
    }
}

/**
 * Update a resource in the API by key and id
 * @param {string} url - The base URL
 * @param {string|number} id - The resource ID
 * @param {string} key - The resource key (e.g., 'events')
 * @param {Object} data - The updated data
 * @returns {Promise<Object>} The updated resource
 */
export async function update(url, id, key, data) {
    const res = await fetch(`${url}${key}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        throw new Error(`Error al actualizar recurso en ${url}${key}/${id}`);
    }

    return await res.json();
}

/**
 * Get a list of resources from the API by key
 * @param {string} url - The base URL
 * @param {string} key - The resource key (e.g., 'events')
 * @returns {Promise<Array>} The list of resources
 */
export async function getList(url, key) {
    const res = await fetch(`${url}${key}`);

    if (!res.ok) {
        throw new Error(`Error al obtener datos de ${url}${key}`);
    }

    return await res.json();
}