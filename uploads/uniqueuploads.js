db.getCollection('players').aggregate([

{

    $match:{

        registrationDate : {

        $gte: ISODate("2021-01-01T00:00:00.000+00:00"),

        $lt: ISODate("2021-02-01T00:00:00.000+00:00")

        },

        videoFeed:{$gte:1},

        isDeleted:false,

        isBlocked:false

        

        }

    },

        {

            $group:{

                

                

                _id:"$country",

                count:{$sum:1}

            }

                

            

            }

    

])