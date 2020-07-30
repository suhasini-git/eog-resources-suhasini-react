import React, { useEffect, SetStateAction } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';
import { Provider, createClient, useQuery } from 'urql';
import { useGeolocation } from 'react-use';
import LinearProgress from '@material-ui/core/LinearProgress';
import Chip from '../../components/Chip';
import { IState } from '../../store';
import { validate } from 'graphql';
import { Select, MenuItem } from '@material-ui/core';
import NowWhat from '../../components/NowWhat';

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const query = `
{getMetrics}
`;

const getWeather = (state: IState) => {
  const { temperatureinFahrenheit, description, locationName } = state.weather;
  return {
    temperatureinFahrenheit,
    description,
    locationName,
  };
};

export default () => {
  return (
    <Provider value={client}>
      <Weather />

    </Provider>
  );
};

const Weather = () => {
  const getLocation = useGeolocation();

  const dispatch = useDispatch();
  const { temperatureinFahrenheit, description, locationName } = useSelector(getWeather);

  const [result] = useQuery({
    query
  });

  const [personName, setPersonName] = React.useState<any[] | []>([]);

  const handleChangeMultiple = (event: any) => {
    const { value } = event.target;
    setPersonName(value);
  };
  const { fetching, data, error } = result;
  useEffect(() => {
    if (error) {
      dispatch(actions.weatherApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;

    dispatch(actions.weatherDataRecevied(data));
  }, [dispatch, data, error]);

  if (fetching) return <LinearProgress />;

  return (
    <div>

      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"

        multiple
        value={personName}
        onChange={handleChangeMultiple}
      >

        <option>Open this select menu</option>
        {data.getMetrics.map((str: string) => {

          return <option key={str} value={str}>
            {str}
          </option>
        })
        }


      </Select> <NowWhat selectedValue={personName}></NowWhat>
    </div>);
};
