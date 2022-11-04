from pathlib import Path


def rootPath(*paths) -> Path:
	return Path(__file__).parent.parent.joinpath(*paths)
