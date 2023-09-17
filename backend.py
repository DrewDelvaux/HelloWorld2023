import sys

import numpy as np
import pandas as pd
from pandas_datareader import data as wb
import matplotlib.pyplot as plt
import seaborn as sns
from scipy.stats import norm
import yfinance as yf


# ticker = 'GOOG'
# data = pd.DataFrame()
# yf.pdr_override()
# data[ticker] = wb.DataReader(ticker, start = '2010-1-1')['Adj Close']

# Plot
# data.plot(figsize=(15,6))
# plt.savefig('prices.png')
# plt.show()

# tickers = ['AMZN', 'GOOG', 'META', 'TSLA']
# for ticker in tickers:
#     yf.pdr_override()
#     data[ticker] = wb.DataReader(ticker, '2015-01-01')['Adj Close']
#     print(data[ticker].tail())


def import_stock_data(tickers, start='2012-1-1'):
    data = pd.DataFrame()
    yf.pdr_override()
    if len([tickers]) == 1:
        data[tickers] = wb.DataReader(tickers, start=start)['Adj Close']
        data = pd.DataFrame(data)
    else:
        for ticker in tickers:
            data[ticker] = wb.DataReader(ticker, start=start)['Adj Close']
    return data


def log_returns(data):
    return np.log(1 + data.ffill().pct_change())


def drift_calc(data):
    lr = log_returns(data)
    u = lr.mean()
    var = lr.var()
    drift = u - (0.5 * var)
    try:
        return drift.values
    except:
        return drift


def daily_returns(data, days, iterations):
    ft = drift_calc(data)
    try:
        stv = log_returns(data).std().values
    except:
        stv = log_returns(data).std()
    dr = np.exp(ft + stv * norm.ppf(np.random.rand(days, iterations)))
    return dr


def probs_find(predicted, higherthan, on='value'):
    if on == 'return':
        predicted0 = predicted.iloc[0, 0]
        predicted = predicted.iloc[-1]
        predList = list(predicted)
        over = [(i * 100) / predicted0 for i in predList if ((i - predicted0) * 100) / predicted0 >= higherthan]
        less = [(i * 100) / predicted0 for i in predList if ((i - predicted0) * 100) / predicted0 < higherthan]
    elif on == 'value':
        predicted = predicted.iloc[-1]
        predList = list(predicted)
        over = [i for i in predList if i >= higherthan]
        less = [i for i in predList if i < higherthan]
    else:
        print("'on' must be either value or return")
    return (len(over) / (len(over) + len(less)))


def simulate_mc(data, days, iterations, plot=True):
    # Generate daily returns
    returns = daily_returns(data, days, iterations)
    # Create empty matrix
    price_list = np.zeros_like(returns)
    # Put the last actual price in the first row of matrix.
    price_list[0] = data.iloc[-1]
    # Calculate the price of each day
    for t in range(1, days):
        price_list[t] = price_list[t - 1] * returns[t]

    # Plot Option
    if plot == True:
        x = pd.DataFrame(price_list).iloc[-1]
        fig, ax = plt.subplots(1, 2, figsize=(14, 4))
        sns.distplot(x, ax=ax[0])
        sns.distplot(x, hist_kws={'cumulative': True}, kde_kws={'cumulative': True}, ax=ax[1])
        plt.xlabel("Stock Price")
        plt.show()

    # CAPM and Sharpe Ratio

    # Printing information about stock
    try:
        [print(nam) for nam in data.columns]
    except:
        print(data.name)
    print(f"Days: {days - 1}")
    print(f"Expected Value: ${round(pd.DataFrame(price_list).iloc[-1].mean(), 2)}")
    print(
        f"Return: {round(100 * (pd.DataFrame(price_list).iloc[-1].mean() - price_list[0, 1]) / pd.DataFrame(price_list).iloc[-1].mean(), 2)}%")
    print(f"Probability of Breakeven: {probs_find(pd.DataFrame(price_list), 0, on='return')}")

    return pd.DataFrame(price_list)


def monte_carlo(tickers, days_forecast, iterations, start_date='2012-1-1', plotten=False):
    data = import_stock_data(tickers, start=start_date)
    simulatedDF = []
    for t in range(len(tickers)):
        y = simulate_mc(data.iloc[:, t], (days_forecast + 1), iterations)
        if plotten == True:
            forplot = y.iloc[:, 0:10]
            forplot.plot(figsize=(15, 4))
    y['ticker'] = tickers[t]
    cols = y.columns.tolist()
    cols = cols[-1:] + cols[:-1]
    y = y[cols]
    simulatedDF.append(y)
    simulatedDF = pd.concat(simulatedDF)
    return simulatedDF


sys.stdout.flush()
