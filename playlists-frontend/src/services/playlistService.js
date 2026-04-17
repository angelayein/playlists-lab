import axios from "axios";
const API_URL = "/api/playlists"

const getPlaylists = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

const createPlaylist = async (playlist)=>{
    const response = await axios.post(API_URL, playlist, {
        withCredentials: true,
    });
    return response.data;
}

const likePlaylist = async (id) => {
  const response = await axios.put(`${API_URL}/${id}/like`);
  return response.data;
};

const deletePlaylist = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    withCredentials: true,
  });

  return response.data;
};

export default {getPlaylists, createPlaylist, likePlaylist, deletePlaylist};