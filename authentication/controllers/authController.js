import validator from 'validator'

export async function registerUser(req, res) {
    
    let { name, email, username, password } = req.body

    // Validation
    if (!name || !email || !username || !password) {
        return res.status(400).json({ error: 'All fields are required.' })
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format.' })
    }

    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long.' })
    }

    // Remove whitespace
    name = name.trim()
    email = email.trim()
    username = username.trim()
    password = password.trim()

    // Regex for username: only letters, numbers, underscores, 3-15 chars
    const usernameRegex = /^[a-zA-Z0-9_-]{1,20}$/
    if (!usernameRegex.test(username)) {
        return res.status(400).json({ error: 'Username must be 3-15 characters long and can only contain letters, numbers, and underscores.' })
    }

    console.log('Registering user with data:', req.body);
    
 }