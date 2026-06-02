from jose import jwt

from app.core.config import get_settings
from app.core.security import create_access_token, hash_password, verify_password


def test_password_hashing_round_trip():
    hashed = hash_password("a-very-secure-password")

    assert hashed != "a-very-secure-password"
    assert verify_password("a-very-secure-password", hashed)
    assert not verify_password("wrong-password", hashed)


def test_create_access_token_contains_subject_and_roles():
    token = create_access_token("user@example.com", ["public"])
    settings = get_settings()

    payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])

    assert payload["sub"] == "user@example.com"
    assert payload["roles"] == ["public"]
    assert "exp" in payload
