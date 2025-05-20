from setuptools import setup, find_packages

setup(
    name="bill-splitter",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "flask",
        "flask-cors",
        "gunicorn",
    ],
)
