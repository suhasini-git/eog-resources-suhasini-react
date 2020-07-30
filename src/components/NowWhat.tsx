import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from './CardHeader';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import { Provider, createClient, useQuery } from 'urql';
import Avatar from './Avatar';
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';

const useStyles = makeStyles({
  card: {
    margin: '5% 25%',
  },
});
const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});
export default (props: any) => {
  return (
    <Provider value={client}>
      <NowWhat props={props} />

    </Provider>
  );
};
const query = `
query($input: [MeasurementQuery]) { 
  getMultipleMeasurements(input: $input) {
    metric
    measurements {
      at
    value
    metric
   unit
   }
    
  }
}
`;



const NowWhat = (props: any) => {
  const classes = useStyles();
  const { props: any } = props;
  let dataArr: any = [];

  if (props.props.selectedValue) {
    props.props.selectedValue.forEach((obj: any) => {
      console.log(obj)
      dataArr.push({ metricName: obj, after: 1581569211900 })
    })

  }
  //let dataObj = { metricName: props.selectedValue, after:  }
  const latLong = dataArr;

  console.log(latLong, props.props);
  const [result] = useQuery({
    query,
    variables: {
      input: latLong,
    },
  });
  const { fetching, data, error } = result;
  let values: any[] = [];
  if (data) {

    if (data.getMultipleMeasurements) {
      if (data.getMultipleMeasurements.length > 0) {

        data.getMultipleMeasurements.forEach((obj: any, index: number) => {

          let result: any[] = obj.measurements.filter((objT: any) => { return (objT.value > 0 && objT.value < 10) });
          for (var i = 0; i <= result.length - 1; i++) {
            values = [...values, result[i]]
          }
        });


      }
    }
  }

  return (
    <div>
      <LineChart width={730} height={250} data={values}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />

        <Line type="monotone" dataKey="value" stroke="#8884d8" />

      </LineChart>


    </div>
  );
};
