import React from 'react'

export const FormConfig = {
    blog: {
        statusLookUp: [
            {
                code: 'Active',
                label: 'Active',
              },
              {
                code: 'Deleted',
                label: 'Deleted',
              },
              {
                code: 'Reported',
                label: 'Reported',
              }
        ]
    },
    leaves: {
        leaveStatus: [
            {
                code: 'Approved',
                label: 'Approved',
              },
              {
                code: 'Pending',
                label: 'Pending',
              },
              {
                code: 'Reject',
                label: 'Reject',
              },
              {
                code: 'Hold',
                label: 'Hold',
              }
        ],
        adhocLeaveStatusLookup: [
            {
                code: 'informed to the HR.',
                label: 'Informed to the HR.',
              },
              {
                code: 'Not Informed to anyone!',
                label: 'Not Informed to anyone!',
              }
        ],
        daysLookup: [
            {
                code: 'fullDay',
                label: 'Full Day',
              },
              {
                code: 'halfDay',
                label: 'Half Day',
              }
        ]
    },
    project: {
        statusLookUp: [
            {
                code: 'started',
                label: 'Started',
              },
              {
                code: 'finished',
                label: 'Finished ',
              },
              {
                code: 'hold',
                label: 'Hold',
              },
              {
                code: 'process',
                label: 'Process',
              },
              {
                code: 'pending',
                label: 'Pending',
              },
              {
                code: 'maintenance',
                label: 'Maintenance',
              },
              {
                code: 'rejected',
                label: 'Rejected',
              },
        ],

        employeeStatusLookup: [
            {
                code: 'working',
                label: 'Working',
              },
              {
                code: 'removed',
                label: 'Removed ',
              }
        ]
    },
    task: {
        typeLookUp: [
            {
                code: 'leave',
                label: 'Leave',
              },
              {
                code: 'work',
                label: 'Work',
              },
              {
                code: 'other',
                label: 'Other...',
              }
        ]
    },
    ticket: {
        typeLookUp: [
            {
                code: 'HRMS',
                label: 'HRMS',
              },
              {
                code: 'project',
                label: 'Project',
              },
              {
                code: 'other',
                label: 'Other...',
              }
        ]
    },
    user: {
        genderLookUp: [
            {
                code: 'm',
                label: 'Male',
              },
              {
                code: 'f',
                label: 'Female',
              },
              {
                code: 'o',
                label: 'Other',
              }
        ],
        degreeLokUp: [
            {
                code: 'BCA',
                label: 'BCA',
              },
              {
                code: 'MCA',
                label: 'MCA',
              },
              {
                code: 'BE',
                label: 'BE',
              }
        ],
        userRoleLookUp: [
            {
                code: 'employee',
                label: 'Employee',
              },
              {
                code: 'hr',
                label: 'HR',
              },
              {
                code: 'tl',
                label: 'Team Leader',
              },
              {
                code: 'pm',
                label: 'Project Manager',
              },
              {
                code: 'admin',
                label: 'Admin',
              },
              {
                code: 'pdm',
                label: 'Product Manager',
              }
        ],
        designationLookUp: [
            {
                code: 'Software Engineer',
                label: 'Software Engineer',
              },
              {
                code: 'Asociate Software Engineer',
                label: 'Asociate Software Engineer',
              },
              {
                code: 'Trainee',
                label: 'Trainee',
              }
        ],
        skillsLookUp: [
            {
                code: 'Mern',
                label: 'Mern',
              },
              {
                code: 'React',
                label: 'React',
              }
        ],
        positionLookUp: [
            {
                code: 'Senior',
                label: 'Senior',
              },
              {
                code: 'Junior',
                label: 'Junior',
              }
        ],
        departmentLookUp: [
            {
                code: 'web development',
                label: 'Web development',
              },
              {
                code: 'developing',
                label: 'Developing',
              },
              {
                code: 'seo',
                label: 'SEO ',
              },
              {
                code: 'qa',
                lable: 'QA',
              },
              {
                code: 'mobile development',
                lable: 'Mobile development',
              }
        ],
        statusLookUp: [
            {
                code: 'Joined',
                label: 'Joined',
              },
              {
                code: 'Left',
                label: 'Left ',
              },
              {
                code: 'Ready To Join',
                label: 'Ready To Join ',
              },
              {
                code: 'Notice Period',
                label: 'Notice Period ',
              }
        ]
    }
}