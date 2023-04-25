import db from '../../models';
import bcryptjs from 'bcryptjs'
import { USER_ROLE } from '../config/constants/enum/auth';
import { Op } from 'sequelize';
import { CATEGORY_STATUS } from '../config/constants/enum/category';
import { POST_STATUS } from '../config/constants/enum/others';

export const run = ()=>{
    (async()=>{
        await createDefaultAdmin()
        await createDefaultStaff()
        await createCategories()
        await createDefaultCollection()
    })()
}

const createDefaultAdmin = async()=>{

    // check if any admin exist

    const admin = await db.users.findOne({
        where: {
            [Op.or]: [
                { role: USER_ROLE.ADMIN },
            ]
        }
    });

    if(admin){
        return null;
    }

    const hashPassword = bcryptjs.hashSync('8Weeksdev$', 8)

    await db.users.create({
        email: 'ovijoyapp@gmail.com',
        password: hashPassword,
        first_name: 'ovijoyapp',
        username: 'ovijoyapp',
        phone: '2348171498476',
        dob: '2022-09-27 18:00:00.000',
        gender: 'male',
        role: USER_ROLE.ADMIN
    })
}

const createDefaultStaff = async()=>{

    // check if any admin exist

    const staff = await db.users.findOne({
        where: {
            [Op.or]: [
                { role: USER_ROLE.STAFF },
            ]
        }
    });

    if(staff){
        return null;
    }

    const hashPassword = bcryptjs.hashSync('8Weeksdev$', 8)

    await db.users.create({
        email: 'ovijoyappstaff@gmail.com',
        password: hashPassword,
        first_name: 'ovijoyappstaff',
        username: 'ovijoyappstaff',
        phone: '2348171498476',
        dob: '2022-09-27 18:00:00.000',
        gender: 'female',
        role: USER_ROLE.STAFF
    })
}

const createCategories = async ()=>{
    const cat = await db.category.findAll();

    if(cat.length !== 0){
        return null;
    }

    const __cat = [
        "Be Inspired",
        "Travels",
        "Hilarious",
        "International News",
        "Hilarious",
        "Self Development",
        "Did you know?",
        "Local News",
    ];

    for (let i = 0; i < __cat.length; i++) {
        const _cat = __cat[i];

        await db.category.create({
            name: _cat,
            status: CATEGORY_STATUS.ACTIVE
        })
        
    }
}

const createDefaultCollection = async()=>{
    const coll = await db.collection.findAll();

    if(coll.length !== 0){
        return null;
    }

    await db.collection.create({
        title: 'General',
        userId: 1,
        status: POST_STATUS.ACTIVE
    });
}