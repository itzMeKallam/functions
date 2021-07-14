exports.createNotificationOnLike = functions.region('asia-south1').firestore.document('/likes/{id}')
.onCreate(snapshot=>{
    db.doc(`/screams/${snapshot.data().screamId}`).get()
    .then(doc=>{
        if(doc.exists){
            return db.doc(`/notifications/${snapshot.id}`).set({
                createdAt: new Data().toISOString(),
                recipient: doc.data().userHandle,
                sender: snapshot.data().userHandle,
                type: 'like',
                read: false,
                screamId: doc.id
            })
        }
    }).then(_=>{
        return
    }).catch(error=>{
        console.error(error)
        return
    })
})

exports.deleteNotificationOnUnlike = functions.region('asia-south1').firestore.document('/likes/{id}')
.onDelete(snapshot=>{
    db.doc(`/notifications/${snapshot.id}`).delete()
    .then(_=>{
        return
    }).catch(error=>{
        console.error(error)
        return
    })
})

exports.createNotificationOnComment = functions.region('asia-south1').firestore.document('/comments/{id}')
.onCreate(snapshot=>{
    db.doc(`/screams/${snapshot.data().screamId}`).get()
    .then(doc=>{
        if(doc.exists){
            return db.doc(`/notifications/${snapshot.id}`).set({
                createdAt: new Data().toISOString(),
                recipient: doc.data().userHandle,
                sender: snapshot.data().userHandle,
                type: 'comment',
                read: false,
                screamId: doc.id
            })
        }
    }).then(_=>{
        return
    }).catch(error=>{
        console.error(error)
        return
    })
})