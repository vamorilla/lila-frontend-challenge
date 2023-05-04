import { isDevelopment } from 'services/constants';

const DEBUG_ENABLED = false; // Switch this variable whenever you need to debug API Route locally to see logs.

const log = (...args) => {
  if (isDevelopment && DEBUG_ENABLED) console.log(...args);
};

// Users hardcoded for simplicity. Usually stored in a database.
// Also, you never store plain passwords, don't do this at home.
const users = [
  {
    id: 1,
    email: 'test@lila.com',
    password: 'test123',
    name: 'Test User',
    sessionToken: 'abc123',
  },
  {
    id: 2,
    email: 'user@lila.com',
    password: 'user123',
    name: 'Regular User',
    sessionToken: '123456',
  },
  {
    id: 1,
    email: 'root@lila.com',
    password: 'root123',
    name: 'Root User',
    sessionToken: 'abcdef',
  },
];

const handler = async ({ method, query, body, headers }, resToFront) => {
  const { endpoint = [] } = query;

  try {
    switch (method.toUpperCase()) {
      case 'POST': {
        console.log(endpoint[0]);
        switch (endpoint[0]) {
          case 'login': {
            const { email, password } = body;
            if (!email || !password)
              return resToFront
                .status(400)
                .json({ data: 'Ha ocurrido un error' });
            const user = users.find((user) => user.email === email);
            if (!user)
              return resToFront
                .status(404)
                .json({ data: 'Usuario no registrado' });
            if (user.password !== password)
              return resToFront
                .status(401)
                .json({ data: 'Contraseña incorrecta' });
            delete user.password;
            return resToFront.status(200).json({ data: user }); // Success
          }
          case 'tokenlogin': {
            if (!headers.authorization)
              return resToFront.status(401).json({ data: null }); // No token provided
            const user = users.find(
              (user) => user.sessionToken === headers.authorization
            );
            if (!user) return resToFront.status(404).json({ data: null }); // User not found
            delete user.password;
            return resToFront.status(200).json({ data: user }); // Success
          }
          default:
            return resToFront.status(404).json({ data: null }); // Endpoint not found
        }
      }
      default:
        return resToFront.status(405).json({ data: null }); // Method not allowed
    }
  } catch (error) {
    log('ERROR: ', error);
    resToFront.status(500).json({ data: 'Ha ocurrido un error' });
  }
};

export default handler;
