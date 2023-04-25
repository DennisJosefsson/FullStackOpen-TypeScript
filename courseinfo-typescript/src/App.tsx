const App = () => {
    interface CoursePartBase {
        name: string;
        exerciseCount: number;
    }

    interface CoursePartDescription extends CoursePartBase {
        description: string;
    }

    interface CoursePartBasic extends CoursePartDescription {
        kind: 'basic';
    }

    interface CoursePartGroup extends CoursePartBase {
        groupProjectCount: number;
        kind: 'group';
    }

    interface CoursePartBackground extends CoursePartDescription {
        backgroundMaterial: string;
        kind: 'background';
    }

    type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground;

    const courseName = 'Half Stack application development';

    const courseParts: CoursePart[] = [
        {
            name: 'Fundamentals',
            exerciseCount: 10,
            description: 'This is an awesome course part',
            kind: 'basic',
        },
        {
            name: 'Using props to pass data',
            exerciseCount: 7,
            groupProjectCount: 3,
            kind: 'group',
        },
        {
            name: 'Basics of type Narrowing',
            exerciseCount: 7,
            description: 'How to go from unknown to string',
            kind: 'basic',
        },
        {
            name: 'Deeper type usage',
            exerciseCount: 14,
            description: 'Confusing description',
            backgroundMaterial:
                'https://type-level-typescript.com/template-literal-types',
            kind: 'background',
        },
        {
            name: 'TypeScript in frontend',
            exerciseCount: 10,
            description: 'a hard part',
            kind: 'basic',
        },
    ];

    const Content = ({ courseParts }: { courseParts: CoursePart[] }) => {
        return (
            <div>
                {courseParts.map((part) => {
                    return <Part key={part.name} coursePart={part} />;
                })}
            </div>
        );
    };

    const Part = ({ coursePart }: { coursePart: CoursePart }) => {
        switch (coursePart.kind) {
            case 'basic':
                return (
                    <div>
                        <b>
                            {coursePart.name} {coursePart.exerciseCount}
                        </b>
                        <p>
                            <em>{coursePart.description}</em>
                        </p>
                    </div>
                );
            case 'group':
                return (
                    <div>
                        <b>
                            {coursePart.name} {coursePart.exerciseCount}
                        </b>
                        <p>Project exercises: {coursePart.groupProjectCount}</p>
                    </div>
                );
            case 'background':
                return (
                    <div>
                        <b>
                            {coursePart.name} {coursePart.exerciseCount}
                        </b>
                        <p>
                            <em>{coursePart.description}</em>
                            <br />
                            {coursePart.backgroundMaterial}
                        </p>
                    </div>
                );
            default: {
                return <></>;
            }
        }
    };

    const Total = ({ courseParts }: { courseParts: CoursePart[] }) => {
        return (
            <p>
                Total of exercises:
                {courseParts.reduce(
                    (prev, curr) => prev + curr.exerciseCount,
                    0
                )}
            </p>
        );
    };

    const Header = ({ courseName }: { courseName: string }) => {
        return <h1>{courseName}</h1>;
    };

    return (
        <div>
            <Header courseName={courseName} />
            <Content courseParts={courseParts} />
            <Total courseParts={courseParts} />
        </div>
    );
};

export default App;
