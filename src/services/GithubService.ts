import axios from "axios";
import { Repository } from "../interfaces/Repository";
import { GithubUser } from "../interfaces/GithubUser";
import { RepositoryPayload } from "../interfaces/RepositoryPayload";

const GITHUB_API_URL = import.meta.env.VITE_GITHUB_API_URL || "https://api.github.com";
const GITHUB_API_TOKEN = import.meta.env.VITE_GITHUB_API_TOKEN; 

const apiClient = axios.create({
    baseURL: GITHUB_API_URL,
    headers: {
        Authorization: `Bearer ${GITHUB_API_TOKEN}`,
        Accept: "application/vnd.github.v3+json"
    }
});

export const fetchRepositories = async () : Promise<Repository[]> => {
    try {
        const response = await apiClient.get("/user/repos", {
            params: {
                per_page:100,
                sort: "created",
                direction: "desc",
                affiliation: "owner",
                t: Date.now()
            }
        });
        if (response.status !== 200) {
            throw new Error(`${response.statusText}`);
        }
        return response.data as Repository[]
    } catch (error) {
        console.log("Error obteniendo repositorios", error);
        throw new Error(`${(error as Error).message}`);
    }
}


export const createRepository = async (repo: RepositoryPayload): Promise<Repository> => {
    try {
        const response = await apiClient.post("user/repos", repo)
        return response.data as Repository
    } catch (error) {
        throw new Error(`${(error as Error).message}`);
    }
}

export const fetchUserInfo = async (): Promise<GithubUser | null> => {
    try {
        const response = await apiClient.get("user");
        if (response.status !== 200) {
            throw new Error (`${response.statusText}`);
        }
        return response.data as GithubUser;
    } catch (error) {
        throw new Error(`${(error as Error).message}`);
    }
}

// ---------------------------------------------------------------------------
// Examen Parcial 2: Métodos DELETE y PATCH
// ---------------------------------------------------------------------------

/**
 * Elimina un repositorio del usuario autenticado.
 * DELETE /repos/{owner}/{repo}
 * GitHub responde con 204 No Content cuando la eliminación es exitosa.
 */
export const deleteRepository = async (owner: string, repoName: string): Promise<void> => {
    try {
        const response = await apiClient.delete(`/repos/${owner}/${repoName}`);
        if (response.status !== 204) {
            throw new Error(`${response.statusText}`);
        }
    } catch (error) {
        console.log("Error eliminando repositorio", error);
        throw new Error(`${(error as Error).message}`);
    }
}

/**
 * Actualiza (edita) un repositorio existente del usuario autenticado.
 * PATCH /repos/{owner}/{repo}
 * Solo se envían los campos editables (nombre y descripción).
 */
export const updateRepository = async (
    owner: string,
    repoName: string,
    repo: RepositoryPayload
): Promise<Repository> => {
    try {
        const response = await apiClient.patch(`/repos/${owner}/${repoName}`, repo);
        if (response.status !== 200) {
            throw new Error(`${response.statusText}`);
        }
        return response.data as Repository;
    } catch (error) {
        console.log("Error actualizando repositorio", error);
        throw new Error(`${(error as Error).message}`);
    }
}

