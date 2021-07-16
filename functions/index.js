const functions = require('firebase-functions')
const express = require('express')
const admin = require('firebase-admin')
admin.initializeApp()
const db = admin.firestore()
// Routes
const scream = require('./routes/scream')
const screams = require('./routes/screams')
const signup = require('./routes/signup')
const login = require('./routes/login')
const uploadImage = require('./routes/uploadImage')
const addUserDetails = require('./routes/addUserDetails')
const getUserDetails = require('./routes/getUserDetails')
const getScream = require('./routes/getScream')
const comment = require('./routes/comment')
const getLike = require('./routes/getLike')
const getUnlike = require('./routes/getUnlike')
const deleteScream = require('./routes/deleteScream')
const markNotificationsRead = require('./routes/markNotificationsRead')
const getUserDetail = require('./routes/getUserDetail')

const app = express()
// screams
app.use('/scream', scream)
app.use('/screams', screams)
app.use('/scream', getScream)
app.use('/delete', deleteScream)
app.use('/like', getLike)
app.use('/unlike', getUnlike)
app.use('/comment', comment)

// user
app.use('/signup', signup)
app.use('/login', login)
app.use('/user', addUserDetails) 
app.use('/user', getUserDetails)
app.use('/user/image', uploadImage)
app.use('/user/', getUserDetail)
app.use('/notifications', markNotificationsRead)
app.get('/check',(req,res)=>{
    console.error('wasted')
    res.status(200).json({message: 'wasted'})
})
app.use((error, req, res, next)=>{
    console.log(error)
    const statusCode = error.statusCode || 500
    const message = error.message
    if(statusCode === 500) {
        message = 'something went wrong, please try again'
    } 
    const code = error.code
    res.status(statusCode).json({
        message,
        code
    })
})

exports.api = functions.region('asia-south1').https.onRequest(app)

exports.createNotificationOnLike = functions
  .region('asia-south1')
  .firestore.document('likes/{id}')
  .onCreate((snapshot) => {
    return db
      .doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then((doc) => {
        if (doc.exists && doc.data.userHandle !== snapshot.data.userHandle) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: 'like',
            read: false,
            screamId: doc.id
          });
        }
      })
      .catch((err) => console.error(err));
  });


exports.deleteNotificationOnUnlike = functions.region('asia-south1').firestore.document('/likes/{id}')
.onDelete(snapshot=>{
    db.doc(`/notifications/${snapshot.id}`).delete()
    .catch(error=> console.error(error))
})

exports.createNotificationOnComment = functions
  .region('asia-south1')
  .firestore.document('comments/{id}')
  .onCreate((snapshot) => {
    return db
      .doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists  && doc.data.userHandle !== snapshot.data.userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: 'comment',
            read: false,
            screamId: doc.id
          });
        }
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  });

  exports.onUserImageChange = functions.region('asia-south1').firestore.document('/users/{userId}')
  .onUpdate(change=>{
      console.log(change.before.data())
      console.log(change.after.data())
      if(change.before.data().avatar !== change.after.data().avatar){
            let batch = db.batch()
            return db.collection('/screams/').where('userHandle', '==' , change.before.data().handle).get()
            .then(data=>{
                data.forEach(doc=>{
                    const scream = db.doc(`/screams/${doc.id}`)
                    batch.update(scream, {avatar: change.after.data().avatar})
                })
                return batch.commit()
            })
      }
      return

  })

  exports.onScreamDelete = functions
  .region('asia-south1')
  .firestore.document('/screams/{screamId}')
  .onDelete((snapshot, context) => {
    const screamId = context.params.screamId;
    const batch = db.batch();
    return db
      .collection('comments')
      .where('screamId', '==', screamId)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        });
        return db
          .collection('likes')
          .where('screamId', '==', screamId)
          .get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        });
        return db
          .collection('notifications')
          .where('screamId', '==', screamId)
          .get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/notifications/${doc.id}`));
        });
        return batch.commit();
      })
      .catch((err) => console.error(err));
  });