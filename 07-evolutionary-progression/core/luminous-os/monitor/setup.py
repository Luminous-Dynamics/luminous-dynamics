from setuptools import setup, find_packages

setup(
    name="luminous-monitor",
    version="0.1.0",
    description="Consciousness-aware process monitor for Luminous OS",
    author="Luminous Dynamics Collective",
    author_email="consciousness@luminousdynamics.com",
    py_modules=["sacred_process_monitor"],
    entry_points={
        "console_scripts": [
            "sacred-monitor=sacred_process_monitor:main",
            "luminous-monitor=sacred_process_monitor:main",
        ],
    },
    install_requires=[
        "psutil>=5.9.0",
        "blessed>=1.19.0",
        "matplotlib>=3.5.0",
        "numpy>=1.21.0",
    ],
    python_requires=">=3.8",
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Environment :: Console",
        "Intended Audience :: System Administrators",
        "License :: OSI Approved :: GNU General Public License v3 (GPLv3)",
        "Operating System :: POSIX :: Linux",
        "Programming Language :: Python :: 3",
        "Topic :: System :: Monitoring",
    ],
)