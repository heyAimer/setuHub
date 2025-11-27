import { useState } from "react";
import Toast from "react-native-toast-message";
import { BASE_URL } from "../constants/api";

export const useComments = () => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const fetchComments = async (postuuid) => {
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
            setComments(data.comments);
            
        } catch (error) {
            console.error("Fetch comments Error: ", error);
        } finally {
            setLoading(false);
        }
    }

    const createComments = async (postuuid, content) => {
        const payload = {
            postUuid: postuuid,
            content:content
        }
        try {
            const response = await fetch(`${BASE_URL}/request/comment/create`,
                {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "X-App-Secret": "smartboyakriti"
                    },
                    body: JSON.stringify(payload),
                }
            );
            if (!response.ok) {
                 const errorData = await response.json().catch(() => ({}));
                Toast.show({
                    type: 'error',
                    text1: 'Server error'
                });
                throw new Error(`Server error ${JSON.stringify(errorData)}`);
            }

            const newComment = await response.json();

            setComments((prev) => [newComment, ...prev]);
            Toast.show({
                type: 'success',
                text1:'Comment created successfully'
            })
            return newComment;
            
        } catch (error) {
            console.error("creating comment error : ", error);
            Toast.show({
                type: 'error',
                text1: "Something went wrong!"
            })
            
        }
    }

    const deleteComments = async (commentUuid) => {
        try {
            const response = await fetch(`${BASE_URL}/request/comment/delete/${commentUuid}`,
                {
                    method: "DELETE",
                    headers: {
                        "X-App-Secret": "smartboyakriti",
                    }
                }
            );
            if (!response.ok) throw new Error("Failed to delete comment.");

            setComments((prev) => prev.filter((c) => c.commentUuid !== commentUuid));
            Toast.show({
                type: 'success',
                text1:'Comment deleted successfully.'
            })
        } catch (error) {
            console.error("Error deleting the comment: ", error);
            Toast.show({
                type: 'error',
                text1:'Error deleting the comment'
            })
        }
    }
    return {
        comments,
        loading,
        fetchComments,
        createComments,
        deleteComments,
    }
}