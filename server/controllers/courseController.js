const db = require('../models')

const Course = db.courses
const Enrollment = db.enrollments;
const Offer = db.offers


const addCourse = async (req, res) => {
    let info = {
        title: req.body.title,
        description: req.body.description,
        domain: req.body.domain,
        startdate: req.body.startdate,
        enddate: req.body.enddate,
        nrmeetings: req.body.nrmeetings,
        cost: req.body.cost,
        availablespots: req.body.availablespots,
        availablelanguage: req.body.availablelanguage,
        profID: req.user.id // ID-ul profesorului logat
    }

    const course = await Course.create(info)
    res.status(200).send(course)
    console.log(course)
}

const getEnrollmentsStatsByProfessor = async (req, res) => {
  try {
    const profID = req.user.id;

    // 1. Obține toate cursurile profesorului
    const courses = await Course.findAll({ where: { profID } });

    // 2. Extrage toate ID-urile cursurilor
    const courseIds = courses.map(c => c.id);

    // 3. Obține toate enrollments pentru aceste cursuri
    const allEnrollments = await Enrollment.findAll({
      where: { courseID: courseIds }
    });

    // 4. Obține toate ofertele pentru cursurile profesorului
    const offers = await db.offers.findAll({
      where: { courseID: courseIds }
    });

    // 5. Creează mapare cursID -> discount
    const offerMap = {};
    offers.forEach(offer => {
      offerMap[offer.courseID] = offer.discount;
    });

    // 6. Creează mapare cursID -> înscrieri pe lună
    const enrollmentCounts = {};
    courseIds.forEach(id => {
      enrollmentCounts[id] = {};
    });

    allEnrollments.forEach(enr => {
      const cid = enr.courseID;
      const month = new Date(enr.createdAt).getMonth(); // 0 = Ian
      if (!enrollmentCounts[cid][month]) enrollmentCounts[cid][month] = 0;
      enrollmentCounts[cid][month]++;
    });

    // 7. Construiește răspunsul final
    const result = courses.map(course => {
      const discount = offerMap[course.id] || null;
      const cost = parseFloat(course.cost);
      const discountedPrice = discount ? parseFloat((cost - (cost * discount / 100)).toFixed(2)) : null;

      return {
        ...course.toJSON(),
        enrollmentCount: allEnrollments.filter(e => e.courseID === course.id).length,
        monthlyEnrollments: enrollmentCounts[course.id] || {},
        discount,
        discountedPrice
      };
    });

    res.status(200).json(result);
  } catch (err) {
    console.error("Eroare la getEnrollmentsStatsByProfessor:", err);
    res.status(500).json({
      message: 'Eroare la obținerea statisticilor de înrolare',
      error: err
    });
  }
};



// 2. get single course
const getOneCourse = async (req, res) => {

    let id = req.params.id
    let course = await Course.findOne({ where: { id: id }})
    res.status(200).send(course)

}
// 3. update course
const updateCourse = async (req, res) => {

    let id = req.params.id

    const course = await Course.update(req.body, { where: { id: id }})
    res.status(200).send(course)

}

// 4. delete course by id
const deleteCourse = async (req, res) => {

    let id = req.params.id
    
    await Course.destroy({ where: { id: id }} )

    res.status(200).send('Course is deleted !')

}

// 5. get all courses
const getAllCourses = async (req, res) => {

  
  // Am înlocuit cu:
  const courses = await Course.findAll();
  const offers = await Offer.findAll();
  
  const offerMap = {};
  offers.forEach((offer) => {
    offerMap[offer.courseID] = offer.discount;
  });
  
  const enrichedCourses = courses.map((course) => {
    const courseJSON = course.toJSON();
    const discount = offerMap[course.id];
    if (discount) {
      courseJSON.offer = {
        discount,
        discountedPrice: (course.cost * (1 - discount / 100)).toFixed(2),
      };
    }
    return courseJSON;
  });
  
  res.status(200).json(enrichedCourses);
}
// 6. get all courses by profID
const getAllCoursesByProfID = async (req, res) => {
    try {
      const profID = req.user.id; // ID-ul userului logat
      const courses = await Course.findAll({ where: { profID } });
      console.log({courses})
      res.status(200).send(courses);
    } catch (err) {
      res.status(500).json({ message: 'Eroare la extragerea cursurilor', error: err });
    }
  };
// 7. get all courses by domain
const getAllCoursesByDomain = async (req, res) => {
    let domain = req.params.domain
    let courses = await Course.findAll({ where: { domain: domain }})
    res.status(200).send(courses)
}
// 8. get all courses by availablelanguage
const getAllCoursesByAvailableLanguage = async (req, res) => {
    let availablelanguage = req.params.availablelanguage
    let courses = await Course.findAll({ where: { availablelanguage: availablelanguage }})
    res.status(200).send(courses)
}
// 9. get all courses by startdate
const getAllCoursesByStartDate = async (req, res) => {
    let startdate = req.params.startdate
    let courses = await Course.findAll({ where: { startdate: startdate }})
    res.status(200).send(courses)
}
// 10. get all courses by enddate
const getAllCoursesByEndDate = async (req, res) => {
    let enddate = req.params.enddate
    let courses = await Course.findAll({ where: { enddate: enddate }})
    res.status(200).send(courses)
}






const getCoursesWithMonthlyEnrollments = async (req, res) => {
    try {
      const profID = req.user.id;
  
      // 1. Preluăm cursurile profesorului
      const courses = await Course.findAll({ where: { profID } });
  
      // 2. Preluăm toate înrolările pentru cursurile profesorului
      const enrollments = await Enrollment.findAll({
        where: {
          courseID: { [Op.in]: courses.map(c => c.id) }
        },
        attributes: [
          'courseID',
          [fn('MONTH', col('createdAt')), 'month']
        ]
      });
  
      // 3. Construim structura de cursuri + enrollmentCount + monthlyEnrollmentCounts
      const result = courses.map(course => {
        const monthlyCounts = Array(12).fill(0);
        enrollments.forEach(e => {
          if (e.courseID === course.id) {
            const month = parseInt(e.get('month')) - 1; // 0-based index
            if (month >= 0 && month <= 11) monthlyCounts[month]++;
          }
        });
  
        return {
          ...course.toJSON(),
          enrollmentCount: monthlyCounts.reduce((a, b) => a + b, 0),
          monthlyEnrollmentCounts: monthlyCounts
        };
      });
  
      res.status(200).json(result);
    } catch (err) {
      console.error('Eroare la generarea statisticilor:', err);
      res.status(500).json({ message: 'Eroare la generarea statisticilor.' });
    }
  };





module.exports = {
    addCourse,
    getOneCourse,
    updateCourse,
    deleteCourse,
    getAllCourses,
    getAllCoursesByProfID,
    getAllCoursesByDomain,
    getAllCoursesByAvailableLanguage,
    getAllCoursesByStartDate,
    getAllCoursesByEndDate,
    getEnrollmentsStatsByProfessor,
    getCoursesWithMonthlyEnrollments
}
