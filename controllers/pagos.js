const { response, request } = require("express");
const { PrismaClient } = require("@prisma/client");
const { evaluarPagina } = require("../helpers/paginacion");
const prisma = new PrismaClient();

const pagosGet = async (req = request, res = response) => {
	res.json({
		msg: 'get'
	})
};
const pagosPost = async (req = request, res = response) => {
	
	res.json({
		msg: 'post'
	})
};
const pagosPut = async (req = request, res = response) => {
	res.json({
		msg: 'put'
	})
};
const pagosDel = async (req = request, res = response) => {
	res.json({
		msg: 'del'
	})
};

module.exports = {
	pagosGet,
	pagosPost,
	pagosPut,
	pagosDel,
};
