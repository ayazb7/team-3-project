import secrets
import sys


def main():
    nbytes = 64
    if len(sys.argv) > 1:
        try:
            nbytes = int(sys.argv[1])
        except ValueError:
            pass
    print(secrets.token_urlsafe(nbytes))


if __name__ == '__main__':
    main()


