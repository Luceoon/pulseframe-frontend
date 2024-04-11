import type { Anim, AnimData } from "./model";

const BASE_URL = "http://localhost:3000/";
const API_URL = BASE_URL + "api/";

export function getImageUrl(filename: string): string {
    return BASE_URL + "files/" + filename;
}

export async function fetchAllAnims(): Promise<Anim[]> {

    console.log("Fetching all anims");
    let anims: Array<Anim> = [];

    let res = await fetch(API_URL + "anim");

    if (res.ok) {
        anims = await res.json();
    } else {
        console.error("Failed to fetch anims");
    }
    
    return anims;
}

export async function uploadAnim(name: string, file: File): Promise<boolean> {

    const formData = new FormData();
    formData.append("name", name);
    formData.append("file", file);


    console.log("Uploading animation");
    let res = await fetch(API_URL + "anim", {
        method: "POST",
        body: formData
    });

    if (res.ok) {
        return true;
    } else {
        console.error("Failed to upload animation");
        return false;
    }
}

export async function deleteAnim(id: number): Promise<boolean> {

    console.log("Deleting animation with id: ", id);
    let res = await fetch(API_URL + "anim/" + id, {
        method: "DELETE"
    });

    if (res.ok) {
        return true;
    } else {
        console.error("Failed to delete animation");
        return false;
    }
}

export async function updateAnim(id: number, data: AnimData): Promise<boolean> {

    let result = await fetch(API_URL + "anim/" + id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    return result.ok;
}

export async function validate(name: string): Promise<boolean> {

    const res = await fetch(API_URL + "validate?name=" + name);

    const result = await res.json();
    return result.valid;
}