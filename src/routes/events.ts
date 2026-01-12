import { Router } from "express";
import { listEvents } from "../services/events";

const router = Router();

router.get("/", async (req, res) => {
        const params: any = {};

        if (req.query.limit) {
        params.limit = Number(req.query.limit);
        }

        if (req.query.cursor) {
        params.cursor = Number(req.query.cursor);
        }

        if (req.query.fromAddress) {
        params.fromAddress = req.query.fromAddress.toString().toLowerCase();
        }

        if (req.query.toAddress) {
        params.toAddress = req.query.toAddress.toString().toLowerCase();
        }

        const events = await listEvents(params);
        res.json(events);

});

export default router;
