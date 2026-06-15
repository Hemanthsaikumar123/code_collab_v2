const pool = require("../config/db");

const findUserById = async (id) => {
    const result = await pool.query(
        `
        SELECT id, username, email, created_at
        FROM users
        WHERE id = $1
        `,
        [id]
    );

    return result.rows[0];
};

const findUserByEmail = async (email) => {
    const result = await pool.query(
        "SELECT * FROM users WHERE email=$1",[email]);
    return result.rows[0];
};

const createUser = async ({
    id, username, email, passwordHash }) => {

    const result = await pool.query(
        `
        INSERT INTO users
        (id, username, email, password_hash)
        VALUES ($1,$2,$3,$4)
        RETURNING id, username, email
        `,
        [id, username, email, passwordHash]
    );

    return result.rows[0];
};

module.exports = {
    findUserById,
    findUserByEmail,
    createUser
};