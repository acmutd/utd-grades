import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Graph } from '../../../';
import { Row, Spin } from 'antd';
import SectionCard from './SectionCard';
import _ from 'lodash';
import general from '../../../../utils/general';

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
`

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

export default function SectionContent({ relatedSections, section, handleRelatedSectionClick }) {
  const [options, setOptions] = useState({ 
    legend: { display: false },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          precision: 0
        },
      }],
    },
    tooltips: {
      enabled: true,
      mode: 'single',
      callbacks: {
        label: (tooltipItems, data) => {
          const { values } = general.splitData(general.convertAssociatedArrayToObjectArray(general.extractGrades(section)));
          const total = _.sum(values);

          let text = [`Students: ${tooltipItems.yLabel}`];
          const count = tooltipItems.yLabel;
          const percentage = (count / total) * 100;

          text.push(`Percentage: ${percentage.toFixed(2)}%`);
          
          return text;
        }
      }
    },
  });

  const [data, setData] = useState({});
  const [totalStudents, setTotalStudents] = useState();

  useEffect(() => {
    const grades = general.extractGrades(section);
    const objectArray = general.convertAssociatedArrayToObjectArray(grades);
    const sortedGrades = general.sortByGrades(objectArray);
    const { keys, values } = general.splitData(sortedGrades);
    const colors = general.getColors(keys);

    setTotalStudents(_.sum(values));
    setData({ labels: keys, datasets: [{ backgroundColor: colors, data: values }]});
  }, [section]);
  
  const renderRelatedSections = () => {
    if (relatedSections) {
      return relatedSections.filter(s => s.id != section.id).map(s => (
        <SectionCard key={s.id} section={s} handleRelatedSectionClick={handleRelatedSectionClick} />
      ))
    }
    
    return <Spin />;
  };


  return (
    <Container>
      <Stack>
        <Header>{section.subject.name} {section.catalogNumber.name}<Section>.{section.number}</Section></Header>
        <SubHeader>{section.instructor1.last}, {section.instructor1.first} - {section.semester.name}</SubHeader>
        <Total>Total Students <span style={{ color: '#333333' }}>{totalStudents}</span></Total>
      </Stack>

      <Row>
        <GraphContainer>
          <Graph type="bar" data={data} options={options} />
        </GraphContainer>
      </Row>

      <OtherSectionsRow>
        <OtherSectionsHeader>Other Sections</OtherSectionsHeader>
        <SectionsContainer>
          {renderRelatedSections()}
        </SectionsContainer>
      </OtherSectionsRow>
    </Container>
  );
}
