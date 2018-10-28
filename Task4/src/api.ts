"use strict";

import constants from "./constant";
import help from "./helper";
import express from "express";
import fs from "fs";

declare type Callback = (err: Error, data: string) => express.Response;

const getEventsFile = (callback: Callback) => {
    fs.readFile("data/events.json", "utf8", callback);
};

const isEmpty = (val: string | number) => {
    return !(typeof (val) !== "undefined" && val !== null && val !== "");
};

// checking for the existence of a key value in constants. If there is no such key in the constants return true
const validateValueOfProperty = (key: string, value: string) => {
    if (!isEmpty(constants[key]) && !isEmpty(value)) {
        const values = value.split(":");
        return values.every((item) => {
            return constants[key].indexOf(item) > -1;
        });
    }
    return true;
};

export default {
    timeUpStatus: (request: express.Request, response: express.Response) => {
        const time: number = process.uptime();
        const uptime: string = help.toHHMMSS(time);
        return response.status(200).send(uptime);
    },

    eventsHandling: (request: express.Request, response: express.Response) => {
        let queryParam;
        switch (request.method) {
            case "POST":
                queryParam = request.body;
                break;
            case "GET":
                queryParam = request.query;
                break;
        }
        let pageNumb = queryParam.pageNumb;
        let maxEntities = queryParam.maxEntities;

        // clear the request object of unnecessary properties, for filtering by the correct first properties
        if (!isEmpty(pageNumb) || !isEmpty(maxEntities)) {
            delete queryParam.pageNumb;
            delete queryParam.maxEntities;
        }
        interface IFilterParam {
            key: string;
            value: string;
        }
        let filterParam = {} as IFilterParam;

        if (Object.keys(queryParam).length) {
            filterParam = {
                key: Object.keys(queryParam)[0],
                value: queryParam[Object.keys(queryParam)[0]].toString(),
            };
            if (!validateValueOfProperty(filterParam.key, filterParam.value)) {
                return response.status(400).send(`incorrect${filterParam.key}`);
            }
        }

        const callback = (err: Error, data: string): express.Response => {
            if (err) {
                throw err;
            }
            const originalEvents = JSON.parse(data).events;

            // if no parameters are specified for the filter, assign the original array
            let finalEvents = Object.keys(filterParam).length ?
                help.eventsFilter(originalEvents, filterParam) : originalEvents;

            // if there are no such events, return 400
            if (finalEvents.length < 1) {
                return response.status(400).send(`no items with [${filterParam.key}] filter`);
            }

            // if paggination is enabled
            if (!isEmpty(pageNumb) && !isEmpty(maxEntities)) {
                if (isNaN(pageNumb) || isNaN(maxEntities)) {
                    return response.status(400).send(`incorrect [${isNaN(pageNumb) ? `{pageNumb: ${pageNumb}}` :
                        ""}${isNaN(maxEntities) ? `{maxEntities: ${maxEntities}}` : ""}] values`);
                }
                pageNumb = Math.abs(pageNumb);
                maxEntities = Math.abs(maxEntities);
                const pagesCount = Math.ceil(finalEvents.length / maxEntities);
                if (pageNumb !== 0) {
                    if (pageNumb > pagesCount) {
                        return response.status(400).send(`the page is too large, allowed number ${pagesCount} pcs`);
                    }
                    finalEvents = finalEvents.slice((pageNumb - 1) * maxEntities, pageNumb * maxEntities);
                    return response.status(200).send(finalEvents);
                }
                return response.status(400)
                    .send(`incorrect page number, for a given number of entities available ${pagesCount} pcs`);
            }
            return response.status(200).send(finalEvents);
        };
        getEventsFile(callback);
    },
};
