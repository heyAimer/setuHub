import { useState } from "react";
import Toast from "react-native-toast-message";
import { BASE_URL } from "../constants/api";

export const useComments = () => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    console.log("fetching comments hey you1")
    
    const fetchComments = async (postuuid) => {
        console.log("fetching comments hey you", postuuid);
        try {
            setLoading(true);
            const response = await fetch(`${BASE_URL}/request/comments/${postuuid}`,
                {
                    method: 'GET',
                    headers: {
                        "X-App-Secret": "smartboyakriti",
                    },
                }
            );

            if (!response.ok) throw new Error("Failed to load comments11111.");

            const data = await response.json();
            console.log("fetching comments : ", data);
            setComments(data.comments);
            
        } catch (error) {
            console.error("Fetch comments Error: ", error);
        } finally {
            setLoading(false);
        }
    }

    const createComments = async (postuuid, content) => {
        try {
            const response = await fetch(`${BASE_URL}/request/comment/create`,
                {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "X-App-Secret": "smartboyakriti",
                    },
                    body: JSON.stringify({ postuuid, content }),
                }
            );
            if (!response.ok) throw new Error("Failed to create comment.");

            const newComment = await response.json();

            setComments((prev) => [newComment, ...prev]);
        } catch (error) {
            console.error("creating comment error : ", error);
            Toast.error({
                type: 'error',
                Text1: "Something went wrong!"
            })
            
        }
    }

    const deleteComments = async (commentuuid) => {
        try {
            const response = await fetch(`${BASE_URL}/request/comment/delete/${commentuuid}`,
                {
                    method: "DELETE",
                    headers: {
                        "X-App-Secret": "smartboyakriti",
                    }
                }
            );
            if (!response.ok) throw new Error("Failed to delete comment.");

            setComments((prev) => prev.filter((c) => c.commentuuid !== commentuuid));
        } catch (error) {
            console.error("Error deleting the comment: ", error);
        }
    }
    return {
        comments,
        loading,
        fetchComments,
        createComments,
        deleteComments
    }
}