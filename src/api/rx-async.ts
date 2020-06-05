/**
 * Command Interface of the CQRS Pattern
 *  Command Query Responsibility Segregation (CQRS)
 *
 * Huan https://github.com/huan May 2020
 */
import {
  from,
  of,
}                 from 'rxjs'
import {
  ignoreElements,
  catchError,
  mapTo,
}                 from 'rxjs/operators'

import {
  getWechaty,
}                 from '../manager'

import * as actions from './actions'

const ding$ = (action: ReturnType<typeof actions.ding>) => of(  // void
  getWechaty(action.payload.wechatyId)
    .ding(action.payload.data)
).pipe(
  ignoreElements(),
  catchError(e => of(
    actions.errorEvent(
      action.payload.wechatyId,
      { data: String(e) },
    )
  )),
)

const reset$ = (action: ReturnType<typeof actions.reset>) => from(  // promise
  getWechaty(action.payload.wechatyId)
    .reset(action.payload.data)
).pipe(
  ignoreElements(),
  catchError(e => of(
    actions.errorEvent(
      action.payload.wechatyId,
      { data: String(e) },
    )
  )),
)

const say$ = (action: ReturnType<typeof actions.sayAsync.request>) => from( // promise
  getWechaty(action.payload.wechatyId)
    .puppet.messageSendText(
      action.payload.conversationId,
      action.payload.text,
    )
).pipe(
  mapTo(actions.sayAsync.success({
    id        : action.payload.id,
    wechatyId : action.payload.wechatyId,
  })),
  catchError(e => of(
    actions.sayAsync.failure({
      error     : e,
      id        : action.payload.id,
      wechatyId : action.payload.wechatyId,
    })
  ))
)

export {
  ding$,
  reset$,
  say$,
}
