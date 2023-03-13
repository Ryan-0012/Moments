import {v4 as uuidv4} from 'uuid' //Ele e o Application servem para colocar a imagem

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Moment from 'App/Models/Moment' //Manipulação de dados no BD

import Application from '@ioc:Adonis/Core/Application' //Permite guardar a imagem no lugar desejado

export default class MomentsController {
    private validationOptions = {
        type:['image'],
        size:'2mb',       
    }

    public async store({request, response}:HttpContextContract) {

        const body = request.body()

        const image = request.file('image', this.validationOptions)

        if(image){
            const imageName = `${uuidv4()}.${image.extname}`

            await image.move(Application.tmpPath('uploads'),{
                name: imageName
            })
            body.image = imageName
        }

        const moment = await Moment.create(body)  //É aqui que haverá coleta de dados das colunas title, description etc.

        response.status(201)

        return{
            menssage: 'Momento criado com sucesso!',
            data: moment
        }
    }

    public async index(){
        const moments = await Moment.query().preload('comments')

        return{
            data:moments,
        }
    }

    public async show({params}: HttpContextContract){

        const moment = await Moment.query()
        .where('id', params.id)
        .preload('comments')
        .firstOrFail()

        

        return{
            data: moment,
        }
    }

    public async destroy({params}: HttpContextContract){
        
        const moment = await Moment.findOrFail(params.id)
        
        await moment.delete()

        return{
            message: 'Momento excluído com sucesso!'
        }
    }
    public async update({params, request}: HttpContextContract){
        const body = request.body()

        const moment = await Moment.findOrFail(params.id)

        moment.title = body.title
        moment.description = body.description
        
        if(moment.image !== body.image || !moment.image){
            const image = request.file('image', this.validationOptions)
            
            if(image){
                const imageName = `${uuidv4()}.${image.extname}`
    
                await image.move(Application.tmpPath('uploads'),{
                    name: imageName
                })
                moment.image = imageName
            }
        }

            await moment.save() //Comando para fazer uma atualização de um dado já existente

            return{
                message:'Atualizado com sucesso!',
                data: moment
            }


    }
}
