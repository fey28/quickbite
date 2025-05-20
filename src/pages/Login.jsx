function Login() {
    return (
      <div className="p-4 max-w-md mx-auto">
        <h2 className="text-xl font-bold">Autentificare</h2>
        <input type="email" placeholder="Email" className="block w-full mt-4 p-2 border rounded" />
        <input type="password" placeholder="Parola" className="block w-full mt-2 p-2 border rounded" />
        <button className="mt-4 w-full bg-orange-500 text-white p-2 rounded">Conectează-te</button>
      </div>
    );
  }
  export default Login;
  