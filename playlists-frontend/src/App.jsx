import { useState, useEffect } from 'react'
import Playlist from './components/Playlist'
import playlistService from './services/playlistService'
import authService from "./services/auth";
import Section from './components/Section';

const App = () => {
  const [playlists, setPlaylists] = useState([]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [newPlaylist, setNewPlaylist] = useState({
    name: "",
    creator: "",
    songs: "",
    likes: "",
  });

  const [loggedUser, setLoggedUser] = useState(null);

  const [notification, setNotification] = useState(null);

  useEffect(() => {
    playlistService.getPlaylists().then((playlists) => setPlaylists(playlists));
  }, []);

  useEffect(() => {
    const refreshUser = async () => {
      try {
        const userInfo = await authService.refreshUser();
        setLoggedUser(userInfo);
      } catch {
        setLoggedUser(null);
      }
    };

    refreshUser();
  }, []);

  const handleSubmit = async (e)=>{
    // prevent page refresh
    e.preventDefault();

    try {
      const result = await authService.login({username, password});
      console.log("Login Response: ", result);
      setLoggedUser({username: result.username, name: result.name});
      showNotification("Login Successful", "success");
    } catch {
      console.log("Invalid Credentials");
      showNotification("Login Failed", "error");
    }

    setUsername("");
    setPassword("");
    
  };

  const handleLogout = async ()=> {
    console.log("logout is clicked.");

    try {
      await authService.logout();
      setLoggedUser(null);
    } catch {
      setLoggedUser(null);
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });

    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handlePlaylistChange = (e) => {
    setNewPlaylist({
      ...newPlaylist,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddPlaylist = async (e)=>{
    e.preventDefault();
    
    const { name, creator, songs, likes } = newPlaylist;
    if (!name || !creator || !songs || !likes) {
      const missingFields = [];

      if (!name) missingFields.push("Playlist Name");
      if (!creator) missingFields.push("Creator");
      if (!songs) missingFields.push("Number of Songs");
      if (!likes) missingFields.push("Likes");

      showNotification(`Failed to add playlist. Missing: ${missingFields.join(", ")}`, "error");

      return;
    }

    try {
      const payload = {
        ...newPlaylist,
        numOfSongs: Number(newPlaylist.songs),
        likes: Number(newPlaylist.likes),
      };
      const addedPlaylist = await playlistService.createPlaylist(payload);
      setPlaylists([...playlists, addedPlaylist]);
      showNotification(`${name} by ${creator} added to playlist.`, "success");
      setNewPlaylist({
        name: "",
        creator: "",
        songs: "",
        likes: ""
      });
    } catch {
      console.log("Error creating playlist.");
      showNotification("Failed to add playlist", "error");
    }
  }

  const handleLike = async (id) => {
    try {
      const updatedPlaylist = await playlistService.likePlaylist(id);

      setPlaylists(
        playlists.map((p) =>
          p.id === id
            ? { ...p, likes: updatedPlaylist.likes }
            : p
        )
      );
    } catch (error) {
      console.log("Error liking playlist");
    }
  };

  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(`Remove ${name}?`);

    if (!confirmDelete) return;

    try {
      await playlistService.deletePlaylist(id);
      
      setPlaylists(playlists.filter((p) => p.id !== id));

      showNotification("Playlist removed successfully", "success");
    } catch (error) {
      console.log("Error deleting playlist");
      showNotification("Failed to delete playlist", "error");
    }
  };

  return (
    <div>
      {notification && (
        <div
          style={{
            padding: "10px",
            marginBottom: "10px",
            color: "white",
            backgroundColor:
              notification.type === "success" ? "green" : "red",
          }}
        >
          {notification.message}
        </div>
      )}
      {loggedUser && <>
        <h2>Playlist Application</h2>
        <i>Hello, {loggedUser.username}! </i>
        <button onClick={handleLogout}>Logout</button>
        <br /><br />
        <h2>Playlists</h2>
        {playlists.map((playlist) => (
          <Section
            key={playlist.id}
            title={`${playlist.name} by ${playlist.creator}`}
          >
            <div>
              <p style={{fontSize: "18px", lineHeight: "0.5"}}>{playlist.name} by {playlist.creator}</p>
              <p style={{fontSize: "18px", lineHeight: "0.5"}}>{playlist.numOfSongs} songs</p>
              <>
                <span style={{fontSize: "18px", lineHeight: "0.5"}}>{playlist.likes} likes </span> 
                <button onClick={() => handleLike(playlist.id)}>like</button>
              </>
              <br /><br />
              <span style={{lineHeight: "0.9"}}>Added by <i>{playlist.user?.username}</i> </span>
              {loggedUser && playlist.userId === loggedUser.id && (
                <button onClick={() => handleDelete(playlist.id, playlist.name)}>Remove the playlist</button>
              )}
            </div>
          </Section>
        ))}
        <br />
        <form onSubmit={handleAddPlaylist}>
          <h2>Add Playlists</h2>
          <span>Playlist Name:</span>
          <input name="name" value={newPlaylist.name} onChange={handlePlaylistChange} />
          <br />
          <span>Creator:</span>
          <input name="creator" value={newPlaylist.creator} onChange={handlePlaylistChange} />
          <br />
          <span>Number of Songs:</span>
          <input name="songs" value={newPlaylist.songs} onChange={handlePlaylistChange} />
          <br />
          <span>Likes:</span>
          <input name="likes" value={newPlaylist.likes} onChange={handlePlaylistChange} />
          <br />
          <button type="submit">Add Playlist</button>
        </form>
      </>}
      {!loggedUser && <>
        <h2>Log in to playlist application</h2>  
        <form onSubmit={handleSubmit}>
          <h3>Login</h3>
          username
          <input value={username} 
            onChange={e=>setUsername(e.target.value)}
          />
          <br />
          password
          <input 
            type="password" 
            value={password} 
            onChange={e=>setPassword(e.target.value)}
          />
          <br />
          <button type="submit">Login</button>
        </form>
      </>}
      
    </div>
  );
};

export default App;
