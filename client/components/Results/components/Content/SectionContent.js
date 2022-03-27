import React from 'react';
import styled from 'styled-components';
import { Row, Spin } from 'antd';
import SectionCard from './SectionCard';
import general from '../../../../utils/general';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const Container = styled.div`
  padding-top: 20px;
  padding-bottom: 50px;

  @media (max-width: 992px) {
    & {
      padding-left: 25px;
      padding-right: 25px;
    }
  }

  @media (min-width: 992px) {
    & {
      padding-left: 50px;
      padding-right: 50px;
    }
  }
`;

const GraphContainer = styled.div`
  width: 100%;

  @media (max-width: 992px) {
    & {
      padding-top: 20px;
      margin-bottom: -20px;
    }
  }

  @media (min-width: 992px) {
    & {
      box-shadow: 0 15px 30px rgba(233, 233, 233, 0.7);
      border-radius: 5px;
      padding: 20px;
    }
  }
`;

const Header = styled.h3`
  font-family: var(--font-family);
  font-weight: 700;
  font-size: 48px;
  margin-bottom: 0px !important;
`;

const SubHeader = styled.h5`
  font-family: var(--font-family);
  font-weight: 600;
  font-size: 22px;
  color: rgb(117, 117, 117);
`;

const Total = styled.h5`
  font-family: var(--font-family);
  font-weight: 600;
  font-size: 18px;
  color: rgb(117, 117, 117);
`;

const Section = styled.span`
  color: rgb(198, 198, 198);
  font-weight: 400;
`;

const OtherSectionsHeader = styled.p`
  font-family: var(--font-family);
  font-weight: 700;
  text-transform: uppercase;
  font-size: 16px;
`;

const OtherSectionsRow = styled(Row)`
  padding-top: 50px;
`;

const SectionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-flow: row nowrap;
  align-content: flex-start;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  padding: 10px;
  margin-left: -10px;
  width: 100%;
`;

const Stack = styled.div`
  display: flex;
  flex-direction: column;
`;

export default function SectionContent({
  relatedSections,
  section,
  handleRelatedSectionClick,
}) {
  const renderRelatedSections = () => {
    if (relatedSections) {
      return relatedSections
        .filter((s) => s.id != section.id)
        .map((s) => (
          <SectionCard
            key={s.id}
            section={s}
            handleRelatedSectionClick={handleRelatedSectionClick}
          />
        ));
    }

    return <Spin />;
  };

  const totalStudents = general.getTotalStudents(section);

  const grades = general.extractGrades(section);
  const keys = Object.keys(grades);
  const values = Object.values(grades);

  const data = {
    labels: keys,
    datasets: [{ backgroundColor: general.getColors(keys), data: values }],
  };

  const options = {
    plugins: {
      tooltip: {
        enabled: true,
        mode: 'nearest',
        interesect: true,
        callbacks: {
          label: (context) => {
            const count = context.parsed.y;
            return [
              `Students: ${count}`,
              `Percentage: ${((count / totalStudents) * 100).toFixed(2)}%`,
            ];
          },
        },
      },
    },
  };

  return (
    <Container>
      <Stack>
        <Header>
          {section.subject.name} {section.catalogNumber.name}
          <Section>.{section.number}</Section>
        </Header>
        <SubHeader>
          {section.instructor1.last}, {section.instructor1.first} -{' '}
          {section.semester.name}
        </SubHeader>
        <Total>
          Total Students{' '}
          <span style={{ color: '#333333' }}>{totalStudents}</span>
        </Total>
      </Stack>

      <Row>
        <GraphContainer>
          <Bar options={options} data={data} />
        </GraphContainer>
      </Row>

      <OtherSectionsRow>
        <OtherSectionsHeader>Other Sections</OtherSectionsHeader>
        <SectionsContainer>{renderRelatedSections()}</SectionsContainer>
      </OtherSectionsRow>
    </Container>
  );
}
