const mongoose = require("mongoose")
const Eviction = require("../../models/studentExtra/eviction")
const Hosting = require("../../models/studentExtra/hosting")
const Late = require("../../models/studentExtra/late")

const addStudentHosting = async (req, res) => {
    try {
        const { userId, propertyId, tenantId } = req.query
        const { name, from, to } = req.body

        let

    }
    catch (error) {
        return res.json({ code: 502, msg: error.message })
    }
}
const addStudentEviction = async (req, res) => {
    try {
        const { userId, propertyId, tenantId } = req.query
        const { name, from, to } = req.body

        let

    }
    catch (error) {
        return res.json({ code: 502, msg: error.message })
    }
}
const addStudentLate = async (req, res) => {
    try {
        const { userId, propertyId, tenantId } = req.query
        const { name, from, to } = req.body

        let

    }
    catch (error) {
        return res.json({ code: 502, msg: error.message })
    }
}
module.exports = {
    addStudentHosting,
    addStudentEviction,
    addStudentHosting,
}