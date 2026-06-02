import boto3
from botocore.config import Config

from app.core.config import get_settings


def create_presigned_upload(key: str, content_type: str) -> dict[str, str]:
    settings = get_settings()
    s3 = boto3.client("s3", region_name=settings.aws_region, config=Config(signature_version="s3v4"))
    url = s3.generate_presigned_url(
        ClientMethod="put_object",
        Params={"Bucket": settings.s3_bucket, "Key": key, "ContentType": content_type, "ServerSideEncryption": "AES256"},
        ExpiresIn=900,
    )
    return {"url": url, "key": key, "bucket": settings.s3_bucket}
