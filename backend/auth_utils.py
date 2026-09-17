"""
Auth utilities - password hashing and login tokens.

Deliberately uses ONLY Python's built-in hashlib/secrets modules, not a
third-party library like bcrypt. Reasoning: your Python version (3.14) is
very new, and brand-new Python releases sometimes don't have ready-made
installable packages for certain libraries yet - avoiding that risk
entirely felt safer than saving a few lines of code, this close to your
deadline. This is still properly secure: PBKDF2 with a random salt per
user and 100,000 iterations is a legitimate, standard password-hashing
approach - not reversible, not plain text, not a toy implementation.

Honest limitation for your report if asked: this is "hackathon-appropriate"
auth, not enterprise-grade. Each user has exactly one active login token at
a time (a new login overwrites the old token), tokens don't expire, and
there's no rate-limiting on failed login attempts. Fine for a demo; not
what you'd ship to production.
"""

import hashlib
import secrets


def hash_password(password: str) -> tuple[str, str]:
    """Returns (password_hash, salt). Store both - you need the salt to verify later."""
    salt = secrets.token_hex(16)
    pwd_hash = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 100_000).hex()
    return pwd_hash, salt


def verify_password(password: str, stored_hash: str, salt: str) -> bool:
    """Re-hashes the given password with the stored salt and compares safely."""
    check_hash = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 100_000).hex()
    return secrets.compare_digest(check_hash, stored_hash)


def generate_token() -> str:
    """A random, unguessable login token - not a JWT, just a secure random string."""
    return secrets.token_hex(32)
