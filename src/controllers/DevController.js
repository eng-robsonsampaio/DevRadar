const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray')
const { findConnections, sendMessage } = require('../websocket')


// index, show, store, update, destroy

module.exports = {
    async index(request, response) {
        const devList = await Dev.find()
        return response.json(devList)
    },

    async store(request, response) {
        const { github_username, techs, latitude, longitude } = request.body;
        
        let dev = await Dev.findOne({github_username})
        if (!dev){
            // get. post, put, delete
            // Query params: request.query (filtros, ordenação, paginação, ...)
            // Route params: request.params (Identificar um recurso na alteração ou remoção)
            // Body params:  request.body (Dados para criação ou alteração de um registro)
            const apiRespose = await axios.get(`https://api.github.com/users/${github_username}`);
        
            const { name=login, avatar_url, bio } = apiRespose.data
        
            // const techsArray = techs.split(',').map(tech => tech.trim());
            const techsArray = parseStringAsArray(techs);
        
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude]
            }
        
            dev = await Dev.create({
                github_username, 
                name, 
                avatar_url, 
                bio, 
                techs: techsArray, 
                location
            })

            // Filter connections that are 10Km from the dev and that have at least one of the technologies 
            const sendSocketMessageTo = findConnections(
                { latitude, longitude }, 
                techsArray,
            ) 

            sendMessage(sendSocketMessageTo, 'new-dev', dev);

        }
        return response.json(dev)
    }, 
        async update(request, response){
            const { _id, github_username, name, bio, techs, latitude, longitude } = request.body;
            
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude]
            }

            let dev = await Dev.findOne({_id})
            console.log(dev)
            if(dev){                
                if(name){
                    dev = await Dev.updateOne(
                        { _id },
                        {
                            $set: { name },
                            $currentDate: { lastModified: true }
                        }
                    )
                }
                if(techs){
                    console.log("Tech is true")
                }
                if(latitude & longitude){
                    dev = await Dev.updateOne(
                        { _id },
                        {
                            $set: { location },
                            $currentDate: { lastModified: true }
                        }
                    )
                }
                if(bio){
                    dev = await Dev.updateOne(
                        { _id },
                        {
                            $set: { bio },
                            $currentDate: { lastModified: true }
                        }
                    )

                }
            }

            return response.json({dev})

    },
        async destroy(request, response){
            const { _id } = request.body;
            console.log(`Name: ${_id}`)
            const dev = await Dev.deleteOne(
                {
                    _id
                }
            )

            return response.json({dev})
        }

};