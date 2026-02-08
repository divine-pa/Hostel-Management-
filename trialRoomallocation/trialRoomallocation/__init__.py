import pymysql

# This tells Django to use PyMySQL as the MySQL client library
pymysql.install_as_MySQLdb()

# Override version check (PyMySQL is compatible with Django but reports old version)
pymysql.version_info = (2, 2, 1, "final", 0)
pymysql.__version__ = "2.2.1"
