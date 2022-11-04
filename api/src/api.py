from fastapi import APIRouter
from starlette.responses import JSONResponse

from src.services import email

router = APIRouter()

@router.get("/vpis/clan")
def vpis_clan():
	return {"Hello": "World"}


@router.get("/izpis")
def izpis():
	return {}

@router.post('/kontakt')
def kontakt():
	return {'kontakt': True}


@router.get("/email")
async def simple_send() -> JSONResponse:
	await email.send(
		recipients=['jar.fmf@gmail.com'],
		template="email_vpis.html",
		subject="Programerski Klub Ljubljana | Potrdilo ob vpisu",
		msg="Te v imenu njegovih članov lepo pozdravlja med svojimi vrstami!")

	return JSONResponse(status_code=200, content={"message": "email has been sent"})
