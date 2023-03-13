import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Moment from 'App/Models/Moment'
import Comment from 'App/Models/Comment'

export default class CommentsController {

    public async store({request, params, response}: HttpContextContract){
        const body = request.body()
        const momentId = params.momentId
        
        await Moment.findOrFail(momentId)

        body.momentId = momentId
    
        const comment = await Comment.create(body)

        response.status(201)

        return{
            message: 'Comentario adicionado com sucesso',
            data: comment,
        }
    }

    public async index({ params }: HttpContextContract) {
        const momentId = params.momentId
        const moment = await Moment.findOrFail(momentId)
        const comments = await moment.related('comments').query()
      
        return comments
      }

}
