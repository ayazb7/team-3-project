import pytest
from app import app as flask_app


@pytest.fixture()
def client():
    flask_app.config['TESTING'] = True
    with flask_app.test_client() as test_client:
        yield test_client


@pytest.fixture()
def mock_mysql(mocker):
    mocked_mysql = mocker.patch('app.mysql')
    mocked_mysql.connection.cursor.return_value = mocker.MagicMock()
    return mocked_mysql
