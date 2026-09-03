// ============================================================
// PHILIP MODEL SCHOOL
// FIRESTORE NOTIFICATION SYSTEM
// ============================================================

import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
    updateDoc,
    doc,
    serverTimestamp
} from
    "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

import { db } from "./firebase-config.js";


// ============================================================
// CREATE NOTIFICATION FOR A STUDENT
// ============================================================

export async function createStudentNotification({

    studentId,

    title,

    message,

    type = "general",

    session = "",

    term = "",

    resultId = ""

}) {

    if (!studentId) {

        console.warn(
            "Notification not created: studentId missing."
        );

        return null;
    }


    try {

        const notificationRef = await addDoc(

            collection(
                db,
                "students",
                studentId,
                "notifications"
            ),

            {

                title,

                message,

                type,

                studentId,

                session,

                term,

                resultId,

                read: false,

                createdAt:
                    serverTimestamp()

            }

        );


        console.log(
            "Notification created:",
            notificationRef.id
        );


        return notificationRef.id;


    } catch (error) {

        console.error(
            "Error creating notification:",
            error
        );

        return null;
    }

}



// ============================================================
// GET STUDENT NOTIFICATIONS
// ============================================================

export async function getStudentNotifications(
    studentId
) {

    if (!studentId) {

        return [];
    }


    try {

        const notificationsQuery = query(

            collection(
                db,
                "students",
                studentId,
                "notifications"
            ),

            orderBy(
                "createdAt",
                "desc"
            )

        );


        const snapshot =
            await getDocs(
                notificationsQuery
            );


        return snapshot.docs.map(
            notification => ({

                id: notification.id,

                ...notification.data()

            })
        );


    } catch (error) {

        console.error(
            "Error loading notifications:",
            error
        );

        return [];
    }

}



// ============================================================
// MARK NOTIFICATION AS READ
// ============================================================

export async function markNotificationAsRead(

    studentId,

    notificationId

) {

    try {

        await updateDoc(

            doc(
                db,
                "students",
                studentId,
                "notifications",
                notificationId
            ),

            {

                read: true

            }

        );

    } catch (error) {

        console.error(
            "Error marking notification as read:",
            error
        );

    }

}



// ============================================================
// MARK ALL NOTIFICATIONS AS READ
// ============================================================

export async function markAllNotificationsAsRead(

    studentId

) {

    const notifications =
        await getStudentNotifications(
            studentId
        );


    for (
        const notification
        of notifications
    ) {

        if (!notification.read) {

            await markNotificationAsRead(

                studentId,

                notification.id

            );

        }

    }

}