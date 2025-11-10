const useToken = async(token, userId) => {

    try {
        const response = await fetch('https://hackathon-connect-app-backend.onrender.com/set/token',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, userId })
            }
        );
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        const data = await response.json();
        console.log('Token successfully sent to backend:', data);
        return data;
    } catch (err) {
        console.error('Failed to send FCM token:', err);
    }

}
export default useToken();