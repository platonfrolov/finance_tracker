
import base64


class APIHelper:
    def __init__(self) -> None:
        pass

    @staticmethod
    def decode_and_save_pdf(b64_string, filename, filedir):
        # print(f"{filedir}{filename}")
        filepath = f"{filedir}{filename}"
        decodeit = open(filepath, 'wb')
        decodeit.write(base64.b64decode(b64_string))
        decodeit.close()
        return filepath
    


