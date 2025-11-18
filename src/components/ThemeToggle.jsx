function ThemeToggle() {
  const toggleTheme = () => {
    document.body.classList.toggle("dark-mode");
  };

  return (
    <button className="btn btn-outline-dark mb-3" onClick={toggleTheme}>
      🌙 Dark Mode
    </button>
  );
}

export default ThemeToggle;
