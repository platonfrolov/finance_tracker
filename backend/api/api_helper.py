
import base64


class APIHelper:
    def __init__(self) -> None:
        pass

    @staticmethod
    def decode_and_save_pdf(b64_string, filename, filedir):
        decodeit = open(f"{filedir}{filename}")
        decodeit.write(base64.b64decode(b64_string))
        decodeit.close()

