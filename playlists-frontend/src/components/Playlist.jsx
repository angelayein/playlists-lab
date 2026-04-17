const Playlist = ({playlist}) => {
    return (
        <div>
            Playlist: {playlist.name}, creator: {playlist.creator}
        </div>
    );
};

export default Playlist;