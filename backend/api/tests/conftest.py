import pytest
from app import create_app


@pytest.fixture()
def client(mock_mysql):
    flask_app = create_app(testing=True)
    with flask_app.test_client() as test_client:
        yield test_client


@pytest.fixture()
def mock_mysql(mocker):
    mocked_mysql = mocker.patch('app.mysql')
    mocked_mysql.connection.cursor.return_value = mocker.MagicMock()
    return mocked_mysql
