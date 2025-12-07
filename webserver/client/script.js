// Get React functions
const { useState, useEffect } = React;

// Sample starting movies
const initialMovies = [
    {
        id: 1,
        title: "Inception",
        rating: 5,
        image: "../public/Inception.jpg"

    },
    {
        id: 2,
        title: "The Dark Knight",
        rating: 5,
        image: "../public/darkKnight.jpg"
    },
    {
        id: 3,
        title: "Interstellar",
        rating: 4,
        image: "../public/Interstaller.jpg"
    },
    {
        id: 4,
        title: "Avengers Endgame",
        rating: 4,
        image: "../public/Endgame.jpg"
    }
];

// Main App Component
function MovieApp() {
    // State variables
    const [movies, setMovies] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editMovie, setEditMovie] = useState(null);

    // Load movies when app starts
    useEffect(() => {
        const saved = localStorage.getItem('movies');
        if (saved) {
            setMovies(JSON.parse(saved));
        } else {
            // Load initial movies if nothing saved
            setMovies(initialMovies);
        }
    }, []);

    // Save movies whenever they change
    useEffect(() => {
        if (movies.length > 0) {
            localStorage.setItem('movies', JSON.stringify(movies));
        }
    }, [movies]);

    // Show add form
    function openAddForm() {
        setEditMovie(null);
        setShowForm(true);
    }

    // Show edit form
    function openEditForm(movie) {
        setEditMovie(movie);
        setShowForm(true);
    }

    // Close form
    function closeForm() {
        setShowForm(false);
        setEditMovie(null);
    }

    // Save movie (add or update)
    function saveMovie(movieData) {
        if (editMovie) {
            // Update existing movie
            const updated = movies.map(m => 
                m.id === editMovie.id ? { ...movieData, id: editMovie.id } : m
            );
            setMovies(updated);
        } else {
            // Add new movie
            const newMovie = {
                ...movieData,
                id: Date.now()
            };
            setMovies([...movies, newMovie]);
        }
        closeForm();
    }

    // Delete movie
    function deleteMovie(id) {
        const confirm = window.confirm('Delete this movie?');
        if (confirm) {
            setMovies(movies.filter(m => m.id !== id));
        }
    }

    // Show form or movie list
    if (showForm) {
        return (
            <MovieForm 
                movie={editMovie}
                onSave={saveMovie}
                onCancel={closeForm}
            />
        );
    }

    return (
        <div className="container">
            <div className="header">
                <h1>Movies</h1>
            </div>
            
            <div className="movie-grid">
                {movies.map(movie => (
                    <MovieCard
                        key={movie.id}
                        movie={movie}
                        onEdit={openEditForm}
                        onDelete={deleteMovie}
                    />
                ))}
            </div>

            <div className="add-button-container">
                <button className="btn-add" onClick={openAddForm}>
                    Add movies
                </button>
            </div>
        </div>
    );
}

// Movie Card Component
function MovieCard({ movie, onEdit, onDelete }) {
    return (
        <div className="movie-card">
            <div className="movie-image">
                {movie.image ? (
                    <img src={movie.image} alt={movie.title} />
                ) : (
                    <span>🎬</span>
                )}
            </div>
            <div className="movie-info">
                <div className="movie-title">
                    Title: {movie.title}
                </div>
                <div className="star-rating">
                    <span style={{fontSize: '14px', color: '#666'}}>Rating:</span>
                    {[1, 2, 3, 4, 5].map(star => (
                        <span 
                            key={star}
                            className={star <= movie.rating ? 'star star-filled' : 'star star-empty'}
                        >
                            ★
                        </span>
                    ))}
                </div>
                <div className="button-group">
                    <button 
                        className="btn btn-update"
                        onClick={() => onEdit(movie)}
                    >
                        Update
                    </button>
                    <button 
                        className="btn btn-remove"
                        onClick={() => onDelete(movie.id)}
                    >
                        Remove
                    </button>
                </div>
            </div>
        </div>
    );
}

// Movie Form Component
function MovieForm({ movie, onSave, onCancel }) {
    // Form state
    const [title, setTitle] = useState(movie ? movie.title : '');
    const [rating, setRating] = useState(movie ? movie.rating : 0);
    const [image, setImage] = useState(movie ? movie.image : '');

    // Handle image upload
    function handleImageChange(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                setImage(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    }

    // Handle form submit
    function handleSubmit() {
        if (!title) {
            alert('Please enter movie title');
            return;
        }
        if (rating === 0) {
            alert('Please select rating');
            return;
        }

        onSave({ title, rating, image });
    }

    return (
        <div className="container">
            <div className="form-page">
                <button className="back-btn" onClick={onCancel}>
                    ← Back to Movies
                </button>
                
                <div className="form-box">
                    <h2 className="form-title">
                        {movie ? 'Update Movie' : 'Add New Movie'}
                    </h2>
                    
                    <div className="form-field">
                        <label className="form-label">Movie Title</label>
                        <input
                            type="text"
                            className="form-input"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter movie name"
                        />
                    </div>

                    <div className="form-field">
                        <label className="form-label">Rating</label>
                        <div className="rating-stars">
                            {[1, 2, 3, 4, 5].map(star => (
                                <span
                                    key={star}
                                    className={`rating-star ${star <= rating ? 'selected' : ''}`}
                                    onClick={() => setRating(star)}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="form-field">
                        <label className="form-label">Movie Poster</label>
                        <input
                            type="file"
                            className="form-input"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        {image && (
                            <div className="image-preview">
                                <img src={image} alt="Preview" />
                            </div>
                        )}
                    </div>

                    <div className="form-buttons">
                        <button className="btn-primary" onClick={handleSubmit}>
                            {movie ? 'Update' : 'Add Movie'}
                        </button>
                        <button className="btn-secondary" onClick={onCancel}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Render the app
ReactDOM.render(<MovieApp />, document.getElementById('app'));